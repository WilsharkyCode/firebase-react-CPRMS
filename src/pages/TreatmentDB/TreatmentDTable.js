import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, remove } from "firebase/database";
import { database } from "../../config/firebase-config";
import TrashIcon from "../../components/Icons/trash-icon-white.png";
import EditIcon from "../../components/Icons/edit-icon-white.png";
import BackIcon from "../../components/Icons/arrow-left-white.png";
import ForwardIcon from "../../components/Icons/arrow-right-white.png";
import BasicModal from "../../components/MaterialUI/MaterialModal";

//Data table, Search query module
export default function TreatmentDTable({ data, patientid }) {
  //filters the TreatmentRecord data to show only
  //records that matches the patient ID
  const filteredData = data.filter(
    (treatmentRecords) =>
      treatmentRecords.patientID &&
      treatmentRecords.patientID.includes(patientid)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const navigate = useNavigate();

  //deletes Item form DB, callback to not auto trigger the function
  const deleteRecords = useCallback((id) => {
    remove(ref(database, "TreatmentRecords/" + id));
    console.log("Delete Success");
  }, []);

  //Cache Module for Editing
  //handles data transfer
  const storeInCache = useCallback((TreatmentRecordData) => {
    const parsedData = JSON.stringify(TreatmentRecordData);
    if ("caches" in window) {
      caches.open("TreatmentRecordData").then((cache) => {
        cache.put("TreatmentRecordData", new Response(parsedData));
        console.log(parsedData);
      });
    }
  }, []);

  //Targeting system for patientData to edit and nav
  //calls storeInCache func
  const startEditing = useCallback(
    (e, treatmentRecords) => {
      e.preventDefault();
      storeInCache(treatmentRecords);
      console.log("Caching success");
      navigate("/edittreatmentrecord");
    },
    [navigate, storeInCache]
  );

  return (
    <div className="container">
      {filteredData.length ? (
        <div>
          <table className="table-format ">
            <thead>
              <tr>
                <th className="table-header-center">Date</th>
                <th className="lg:table-header lg:table-cell hidden">
                  Procedure
                </th>
                <th className="table-header">Amount Paid</th>
                <th className="table-header">Balance</th>
                <th className="table-header">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {/*data is renamed as patient and index is a number counter*/}
              {filteredData
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((treatmentRecords) => (
                  <tr key={treatmentRecords.id}>
                    <td className="data-cell-center">
                      {treatmentRecords.date}
                    </td>
                    <td className="min-w-48  lg:line-clamp-1 m-6  hidden">
                      {treatmentRecords.procedure}
                    </td>
                    <td className="data-cell ">
                      {treatmentRecords.amountPaid}
                    </td>
                    <td className="data-cell">{treatmentRecords.balance}</td>

                    {/*Actions*/}
                    <td className="action-cell ">
                      <button
                        className="icons-btn bg-emerald-400 hover:bg-emerald-500"
                        onClick={(e) => startEditing(e, treatmentRecords)}
                      >
                        <img
                          src={EditIcon}
                          alt="Edit"
                          width="20px"
                          height="20px"
                        />
                      </button>
                      <button
                        className="icons-btn bg-red-400 hover:bg-red-500"
                        onClick={() => deleteRecords(treatmentRecords.id)}
                      >
                        <img
                          src={TrashIcon}
                          alt="Delete"
                          width="20px"
                          height="20px"
                        />
                      </button>
                      <BasicModal
                        ButtonName={"VIEW PROCEDURE"}
                        Header={"PROCEDURE DETAILS:"}
                        Body={treatmentRecords.procedure}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination mt-3">
            <button
              className="icons-btn bg-pastelpurple hover:bg-violet-800"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <img src={BackIcon} alt="Back" width="24px" height="24px" />
            </button>
            <span>
              Page {currentPage} of{" "}
              {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <button
              className="icons-btn bg-pastelpurple hover:bg-violet-800"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
              }
            >
              <img src={ForwardIcon} alt="Back" width="24px" height="24px" />
            </button>
          </div>
          {/*Main Program End*/}
        </div>
      ) : (
        <div className="text-center">0 Records Found</div>
      )}
    </div>
  );
}

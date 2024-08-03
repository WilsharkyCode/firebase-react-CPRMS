import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, remove } from "firebase/database";
import { database } from "../config/firebase-config";
import ballot from "./Icons/ballot.png";
import EditIcon from "./Icons/edit-icon-white.png";
import TrashIcon from "./Icons/trash-icon-white.png";
import ForwardIcon from "./Icons/arrow-right-white.png";
import BackIcon from "./Icons/arrow-left-white.png";
import WarningModal from "./MaterialUI/WarningMUI";

//Data table, Search query module
export default function DataTable({ data, dataRecords }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const navigate = useNavigate();

  //Func to Open Treatment record and send patientData
  //handles data transfer
  const cachepatientData = useCallback((patientData) => {
    const parsedData = JSON.stringify(patientData);
    if ("caches" in window) {
      caches.open("TRPatientData").then((cache) => {
        cache.put("TRPatientData", new Response(parsedData));
        console.log(parsedData);
      });
    }
  }, []);
  //Targeting system for patientData to edit and nav
  //calls cachepatientData func
  const getPatientDetails = useCallback(
    (e, patientData) => {
      e.preventDefault();
      cachepatientData(patientData);
      console.log("Caching success");
      navigate("/treatment");
    },
    [navigate, cachepatientData]
  );

  //deletes Item form DB, callback to not auto trigger the function
  const deleteRecords = useCallback((id, dataRecords) => {
    remove(ref(database, "patients/" + id));

    //delete every record with a certain ID
    dataRecords
      .filter(
        (treatmentRecords) =>
          treatmentRecords.patientID && treatmentRecords.patientID.includes(id)
      )
      .map((treatmentRecords) =>
        remove(ref(database, "TreatmentRecords/" + treatmentRecords.id))
      );
    console.log("Delete Success");
  }, []);

  //Cache Module for Editing
  //handles data transfer
  const storeInCache = useCallback((patientData) => {
    const parsedData = JSON.stringify(patientData);
    if ("caches" in window) {
      caches.open("PatientData").then((cache) => {
        cache.put("PatientData", new Response(parsedData));
        console.log(parsedData);
      });
    }
  }, []);

  //Targeting system for patientData to edit and nav
  //calls storeInCache func
  const startEditing = useCallback(
    (e, patientData) => {
      e.preventDefault();
      storeInCache(patientData);
      console.log("Caching success");
      navigate("/editrecordform");
    },
    [navigate, storeInCache]
  );

  return (
    <div className="flex items-center justify-center flex-col">
      <table className="table-format ">
        <thead>
          <tr>
            <th className="table-header-center">PATIENT ID</th>
            <th className="table-header ">FIRST NAME</th>
            <th className="table-header">LAST NAME</th>
            <th className="table-header">MIDDLE INITIAL</th>
            <th className="table-header">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {/*data is renamed as patient and index is a number counter*/}
          {data.slice(indexOfFirstItem, indexOfLastItem).map((patient) => (
            <tr key={patient.id}>
              <td className="data-cell-center">{patient.id}</td>
              <td className="data-cell">{patient.firstName}</td>
              <td className="data-cell">{patient.lastName}</td>
              <td className="data-cell">{patient.middleInitial}</td>

              {/*Actions*/}
              <td className="action-cell">
                <button
                  className="icons-btn border bg-slate-50 hover:bg-slate-400"
                  onClick={(e) => getPatientDetails(e, patient)}
                >
                  <img
                    src={ballot}
                    alt="Open Records"
                    width="20px"
                    height="20px"
                  />
                </button>
                <br />
                <button
                  className="icons-btn bg-emerald-400 hover:bg-emerald-500"
                  onClick={(e) => startEditing(e, patient)}
                >
                  <img src={EditIcon} alt="Edit" width="20px" height="20px" />
                </button>
                <WarningModal id={patient.id} dataRecords={dataRecords} />

                {/*
                <button
                  className="icons-btn bg-red-400 hover:bg-red-500"
                  onClick={() => deleteRecords(patient.id, dataRecords)}
                >
                  <img
                    src={TrashIcon}
                    alt="Delete"
                    width="20px"
                    height="20px"
                  />
                </button>
                */}
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
        <span className="m-2 font-semibold">
          Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
        </span>
        <button
          className="icons-btn bg-pastelpurple hover:bg-violet-800"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
        >
          <img src={ForwardIcon} alt="forward" width="24px" height="24px" />
        </button>
      </div>
    </div>
  );
}

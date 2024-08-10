import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref, push } from "firebase/database";
import CustomHeader from "../../components/CustomHeader";

export default function AddTreatmentRecord() {
  const navigate = useNavigate();
  const [patientUID, setpatientUID] = useState("");
  const [addItem, setAddItem] = useState({
    patientID: null,
    date: "",
    procedure: "",
    amountPaid: 0,
    balance: 0,
  });

  //Cache Retriever
  //Retrieves Cached ID and Post them to setAddItem
  //convert cache to parsedData
  useEffect(() => {
    if ("caches" in window) {
      caches.open("AddRecordCache").then((cache) => {
        cache.match("AddRecordCache").then((response) => {
          if (response) {
            response.text().then((id) => {
              const parsedData = JSON.parse(id);
              console.log("Retrieved from cache: id:", parsedData);
              setpatientUID(parsedData);
            });
          } else {
            console.log("Nothing in cache");
          }
        });
      });
    }
  }, []);

  //AutoGenerates ID then add
  const addItems = () => {
    try {
      const TRRef = ref(database, "TreatmentRecords/"); //Directory
      const NewTRRef = push(TRRef); //IDGenerator
      set(NewTRRef, {
        patientID: patientUID,
        date: addItem.date,
        procedure: addItem.procedure,
        amountPaid: addItem.amountPaid,
        balance: addItem.balance,
      });
      navigate("/treatment");
    } catch (error) {
      console.error("Error adding document ");
    }
  };

  //BackButton
  const handleBackButton = useCallback(() => {
    navigate("/treatment");
  }, [navigate]);

  return (
    <>
      <CustomHeader />
      <div className="record-container bg-slate-200 h-screen overflow-auto">
        <form
          className="bg-slate-100 drop-shadow-lg md:scale-100 scale-75 "
          onSubmit={addItems}
        >
          <h3 className="h3">Enter Treatment Record Data</h3>
          <br />
          <table>
            <tr>
              <td className="flex align-items-baseline ">
                <label className="form-date-margin">Date:</label>
                <input
                  className="add-input min-w-96"
                  type="date"
                  onChange={(e) =>
                    setAddItem((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="flex align-items-baseline ">
                <label className="form-amount-margin text-nowrap">
                  Amount Paid:
                </label>
                <input
                  className="add-input min-w-96"
                  type="number"
                  onChange={(e) =>
                    setAddItem((prev) => ({
                      ...prev,
                      amountPaid: e.target.value,
                    }))
                  }
                  placeholder="Amount Paid"
                  required
                />
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <label>Remaining Balance:</label>
                <input
                  className="add-input min-w-96"
                  type="number"
                  onChange={(e) =>
                    setAddItem((prev) => ({
                      ...prev,
                      balance: e.target.value,
                    }))
                  }
                  placeholder="Balance"
                  required
                />
              </td>
            </tr>

            <tr>
              <td>
                <label>Procedure:</label>
                <textarea
                  className="add-input resize-none "
                  onChange={(e) =>
                    setAddItem((prev) => ({
                      ...prev,
                      procedure: e.target.value,
                    }))
                  }
                  placeholder="Procedure"
                  rows="5"
                  cols="70"
                  required
                />
              </td>
            </tr>
          </table>

          {/*Form Options*/}
          <div className="mt-4">
            <button className="text-btn float-right" type="submit">
              Create Record
            </button>
            <button
              className="bg-slate-100 hover:bg-slate-400 text-slate-500 hover:text-white 
            rounded-sm px-4 py-2 text-center drop-shadow-md border-gray-300 border-1"
              onClick={handleBackButton}
            >
              Back to Treatment Record Database
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

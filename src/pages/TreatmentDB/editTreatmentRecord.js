import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref } from "firebase/database";
import CustomHeader from "../../components/CustomHeader";

export default function EditTreatmentRecord() {
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState({
    id: null,
    patientID: "",
    date: "",
    procedure: "",
    amountPaid: 0,
    balance: 0,
  });
  //Retrieves Cached ID and Post them to editingItem
  useEffect(() => {
    if ("caches" in window) {
      caches.open("TreatmentRecordData").then((cache) => {
        cache.match("TreatmentRecordData").then((response) => {
          if (response) {
            response.text().then((TreatmentRecord) => {
              const parsedData = JSON.parse(TreatmentRecord);
              console.log("Retrieved from cache:", parsedData);
              setEditingItem(parsedData);
            });
          } else {
            console.log("Nothing in cache");
          }
        });
      });
    }
  }, []);

  //OnClick, Updates Patient Details
  const editItems = () => {
    try {
      set(ref(database, "TreatmentRecords/" + editingItem.id), {
        patientID: editingItem.patientID,
        date: editingItem.date,
        procedure: editingItem.procedure,
        amountPaid: editingItem.amountPaid,
        balance: editingItem.balance,
      });
      navigate("/treatment");
    } catch (error) {
      console.error("Error adding document ");
    }
  };

  const handleBackButton = useCallback(() => {
    navigate("/treatment");
  }, [navigate]);

  return (
    <>
      <CustomHeader />
      <div className="record-container bg-slate-200 h-screen">
        <form className="bg-slate-100 drop-shadow-lg" onSubmit={editItems}>
          <h3 className="h3">Edit Treatment Record Data</h3>
          <table>
            <tr>
              {/*Invisible, Just for targeting of */}
              <input
                type="text"
                value={editingItem.id}
                onChange={(e) =>
                  setEditingItem((prev) => ({ ...prev, id: e.target.value }))
                }
                required
                hidden
              />
              <input
                type="text"
                value={editingItem.patientID}
                onChange={(e) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    patientID: e.target.value,
                  }))
                }
                required
                hidden
              />
              {/*Invisible, Just for targeting of */}
            </tr>
            <tr>
              <td className="flex align-items-baseline ">
                <label className="form-date-margin">Date:</label>
                <input
                  className="add-input min-w-96"
                  type="date"
                  value={editingItem.date}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
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
                  value={editingItem.amountPaid}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
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
                  value={editingItem.balance}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
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
                  value={editingItem.procedure}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
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

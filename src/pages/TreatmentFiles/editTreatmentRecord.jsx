import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref } from "firebase/database";
import { Toolbar } from "@mui/material";
import CryptoJS from "crypto-js";

// AES encryption key
const SECRET_KEY = process.env.REACT_APP_AES_ENCRYPTION_KEY; 

export default function EditTreatmentRecord() {
  const [editingItem, setEditingItem] = useState({
    id: null,
    patientID: "",
    date: "",
    procedure: "",
    amountPaid: 0,
    balance: 0,
  });

  const navigate = useNavigate();

  const handleBackButton = useCallback(() => {
    navigate("/patient/treatment");
  }, [navigate]);

  // 🔓 Decrypt and Retrieve Cached TreatmentRecordData
  useEffect(() => {
    if ("caches" in window) {
      caches.open("TreatmentRecordData").then((cache) => {
        cache.match("TreatmentRecordData").then((response) => {
          if (response) {
            response.text().then((encryptedText) => {
              try {
                const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

                if (!decryptedData) {
                  console.error("Failed to decrypt data.");
                  return;
                }

                const parsedData = JSON.parse(decryptedData);
                console.log("Decrypted & Retrieved from cache:", parsedData);
                setEditingItem(parsedData);
              } catch (err) {
                console.error("Decryption or parsing error:", err);
              }
            });
          } else {
            console.log("Nothing in cache");
          }
        });
      });
    }
  }, []);



  const handleEdit = (e) => {
    e.preventDefault();
    try {
      set(ref(database, "TreatmentRecords/" + editingItem.id), {
        patientID: editingItem.patientID,
        date: editingItem.date,
        procedure: editingItem.procedure,
        amountPaid: editingItem.amountPaid,
        balance: editingItem.balance,
      }); // Store encrypted data in cache
      navigate("/patient/treatment");
    } catch (error) {
      console.error("Error updating document", error);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <Toolbar className="my-4">
        <div className="flex-grow flex items-center justify-center px-4">
          <form
            className="bg-slate-100 drop-shadow-lg md:scale-100 scale-90 w-full max-w-md rounded-xl p-6"
            onSubmit={handleEdit}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              Edit Treatment Record Data
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1">Date:</label>
                <input
                  className="add-input w-full"
                  type="date"
                  value={editingItem.date}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, date: e.target.value })
                  }
                  required
                />
              </div>
              

              <div>
                <label className="block mb-1">Amount Paid:</label>
                <input
                  className="add-input w-full"
                  type="number"
                  value={editingItem.amountPaid}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      amountPaid: e.target.value,
                    })
                  }
                  placeholder="Amount Paid"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Remaining Balance:</label>
                <input
                  className="add-input w-full"
                  type="number"
                  value={editingItem.balance}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      balance: e.target.value,
                    })
                  }
                  placeholder="Balance"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Procedure:</label>
                <textarea
                  className="add-input w-full resize-none"
                  value={editingItem.procedure}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      procedure: e.target.value,
                    })
                  }
                  placeholder="Procedure"
                  rows="5"
                  required
                />
              </div>
            </div>

            <Toolbar className="mt-6 grid grid-cols-1 md:grid-cols-2  gap-4">
            <button className="text-btn rounded-md md:px-14 md:hidden block" type="submit">
              Save
            </button>
              <button
                className="bg-slate-100 hover:bg-slate-400 text-slate-500 hover:text-white rounded-md md:px-14 py-2 text-center drop-shadow-md border-gray-300 border-1"
                onClick={handleBackButton}
              >
                Back
              </button>
              <button className="text-btn rounded-md md:px-14 md:block hidden" type="submit">
                Save
              </button>
            </Toolbar>
          </form>
        </div>
      </Toolbar>
    </div>
  );
}

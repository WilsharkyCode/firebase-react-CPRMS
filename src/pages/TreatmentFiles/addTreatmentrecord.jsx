import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref, push } from "firebase/database";
import { Toolbar } from "@mui/material";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_AES_ENCRYPTION_KEY;

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

  useEffect(() => {
    if ("caches" in window) {
      caches.open("AddRecordCache").then((cache) => {
        cache.match("AddRecordCache").then((response) => {
          if (response) {
            response.text().then((encryptedText) => {
              try {
                const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

                if (!decryptedData) {
                  console.error("❌ Failed to decrypt AddRecordCache data.");
                  return;
                }

                const parsedData = JSON.parse(decryptedData);
                console.log("🔓 Retrieved from AddRecordCache:", parsedData);
                setpatientUID(parsedData);
              } catch (err) {
                console.error("⚠️ Cache decryption error:", err);
              }
            });
          }
        });
      });
    }
  }, []);

  const addItems = (e) => {
    e.preventDefault();
    try {
      const TRRef = ref(database, "TreatmentRecords/");
      const NewTRRef = push(TRRef);
      set(NewTRRef, {
        patientID: patientUID,
        date: addItem.date,
        procedure: addItem.procedure,
        amountPaid: addItem.amountPaid,
        balance: addItem.balance,
      });
      navigate("/patient/treatment");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleBackButton = useCallback(() => {
    navigate("/patient/treatment");
  }, [navigate]);

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <Toolbar className="my-4">
        <div className="flex-grow flex items-center justify-center px-4">
          <form
            className="bg-slate-100 drop-shadow-lg md:scale-100 scale-90 w-full max-w-md rounded-xl p-6"
            onSubmit={addItems}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              New Treatment Record
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1">Date:</label>
                <input
                  className="add-input w-full"
                  type="date"
                  onChange={(e) =>
                    setAddItem({ ...addItem, date: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Amount Paid:</label>
                <input
                  className="add-input w-full"
                  type="number"
                  onChange={(e) =>
                    setAddItem({ ...addItem, amountPaid: e.target.value })
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
                  onChange={(e) =>
                    setAddItem({ ...addItem, balance: e.target.value })
                  }
                  placeholder="Balance"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Procedure:</label>
                <textarea
                  className="add-input w-full resize-none"
                  onChange={(e) =>
                    setAddItem({ ...addItem, procedure: e.target.value })
                  }
                  placeholder="Procedure"
                  rows="5"
                  required
                />
              </div>
            </div>

            <Toolbar className="mt-6 grid grid-cols-1 md:grid-cols-2  gap-4">
            <button className="text-btn rounded-md md:px-14 md:hidden block" type="submit">
              Add
            </button>
              <button
                className="bg-slate-100 hover:bg-slate-400 text-slate-500 hover:text-white rounded-md md:px-14 py-2 text-center drop-shadow-md border-gray-300 border-1"
                onClick={handleBackButton}
              >
                Back
              </button>
              <button className="text-btn rounded-md md:px-14 md:block hidden" type="submit">
                Add
              </button>
            </Toolbar>
          </form>
        </div>
      </Toolbar>
    </div>
  );
}
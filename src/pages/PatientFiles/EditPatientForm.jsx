import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref } from "firebase/database";
import { Toolbar } from "@mui/material";
import CryptoJS from "crypto-js";

//Advanced Encryption Standard Key
const SECRET_KEY = process.env.REACT_APP_AES_ENCRYPTION_KEY; 

// Edit Patient Details
export default function EditPatientForm() {
  const [editingItem, setEditingItem] = useState({
    id: null,
    firstName: "",
    lastName: "",
    middleInitial: "",
    birthday: "",
    age: "",
    phoneNum: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleBackButton = useCallback(() => {
    navigate("/patient");
  }, [navigate]);

  // 🔓 Decrypt and Retrieve Cached PatientData
  useEffect(() => {
    if ("caches" in window) {
      caches.open("PatientData").then((cache) => {
        cache.match("PatientData").then((response) => {
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
      set(ref(database, "patients/" + editingItem.id), {
        firstName: editingItem.firstName,
        lastName: editingItem.lastName,
        middleInitial: editingItem.middleInitial,
        birthday: editingItem.birthday,
        age: editingItem.age,
        phoneNum: editingItem.phoneNum,
        email: editingItem.email,
      });
      navigate("/patient");
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
              Edit Patient Data
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">First Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={editingItem.firstName}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, firstName: e.target.value })
                  }
                  placeholder="First Name"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Last Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={editingItem.lastName}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Middle Initial:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={editingItem.middleInitial}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, middleInitial: e.target.value })
                  }
                  placeholder="Middle Initial"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Age:</label>
                <input
                  className="add-input w-full"
                  type="number"
                  value={editingItem.age}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, age: e.target.value })
                  }
                  placeholder="Age"
                />
              </div>

              <div>
                <label className="block mb-1">Birthday:</label>
                <input
                  className="add-input w-full"
                  type="date"
                  value={editingItem.birthday}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, birthday: e.target.value })
                  }
                  placeholder="Birthday"
                />
              </div>

              <div>
                <label className="block mb-1">Phone #:</label>
                <input
                  className="add-input w-full"
                  type="number"
                  value={editingItem.phoneNum}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, phoneNum: e.target.value })
                  }
                  placeholder="Phone Number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Email:</label>
                <input
                  className="add-input w-full"
                  type="email"
                  value={editingItem.email}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, email: e.target.value })
                  }
                  placeholder="Email"
                />
              </div>
            </div>

            {/* Form Options */}
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

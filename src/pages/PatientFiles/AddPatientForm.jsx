import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref } from "firebase/database";
import { Toolbar } from "@mui/material";

// Input Patient Details
export default function AddPatientForm() {
  const [addItem, setAddItem] = useState({
    patientID: null,
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

  const addItems = (e) => {
    e.preventDefault();
    try {
      const itemId = new Date().getTime().toString();
      set(ref(database, "patients/" + itemId), {
        ...addItem,
      });

      navigate("/patient");
    } catch (error) {
      console.error("Error adding document");
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <Toolbar className="my-4">
        <div className="flex-grow flex items-center justify-center px-4">
          <form
            className="bg-slate-100 drop-shadow-lg md:scale-100 scale-90 w-full max-w-md rounded-xl p-6"
            onSubmit={addItems}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              Enter Patient Data
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">First Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={addItem.firstName}
                  onChange={(e) =>
                    setAddItem({ ...addItem, firstName: e.target.value })
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
                  value={addItem.lastName}
                  onChange={(e) =>
                    setAddItem({ ...addItem, lastName: e.target.value })
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
                  value={addItem.middleInitial}
                  onChange={(e) =>
                    setAddItem({ ...addItem, middleInitial: e.target.value })
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
                  value={addItem.age}
                  onChange={(e) =>
                    setAddItem({ ...addItem, age: Number(e.target.value) })
                  }
                  placeholder="Age"
                />
              </div>

              <div>
                <label className="block mb-1">Birthday:</label>
                <input
                  className="add-input w-full"
                  type="date"
                  value={addItem.birthday}
                  onChange={(e) =>
                    setAddItem({ ...addItem, birthday: e.target.value })
                  }
                  placeholder="Birthday"
                />
              </div>

              <div>
                <label className="block mb-1">Phone #:</label>
                <input
                  className="add-input w-full"
                  type="number"
                  value={addItem.phoneNum}
                  onChange={(e) =>
                    setAddItem({ ...addItem, phoneNum: Number(e.target.value) })
                  }
                  placeholder="Phone Num."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Email:</label>
                <input
                  className="add-input w-full"
                  type="email"
                  value={addItem.email}
                  onChange={(e) =>
                    setAddItem({ ...addItem, email: e.target.value })
                  }
                  placeholder="Email"
                />
              </div>
            </div>

            {/* Form Options */}
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

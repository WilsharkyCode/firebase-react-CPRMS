import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { ref, set, onValue } from "firebase/database";
import { Toolbar } from "@mui/material";

export default function AddEmployeeForm() {
  const [employee, setEmployee] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    branchID: "",
    gender: "",
    position: "",
    hireDate: "",
    bankAccountNumber: "",
  });

  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  // Fetch branches
  useEffect(() => {
    const branchRef = ref(database, "Branches/");
    onValue(branchRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setBranches(loaded);
    });
  }, []);

  const handleBackButton = useCallback(() => {
    navigate("/employees");
  }, [navigate]);

  const addEmployee = (e) => {
    e.preventDefault();
    try {
      const employeeId = new Date().getTime().toString();
      set(ref(database, "Employees/" + employeeId), {
        ...employee,
      });
      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <Toolbar className="my-4">
        <div className="flex-grow flex items-center justify-center px-4">
          <form
            className="bg-slate-100 drop-shadow-lg md:scale-100 scale-90 w-full max-w-md rounded-xl p-6"
            onSubmit={addEmployee}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              Add Employee
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">First Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={employee.firstName}
                  onChange={(e) =>
                    setEmployee({ ...employee, firstName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Middle Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={employee.middleName}
                  onChange={(e) =>
                    setEmployee({ ...employee, middleName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Last Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={employee.lastName}
                  onChange={(e) =>
                    setEmployee({ ...employee, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Branch:</label>
                <select
                  className="add-input w-full"
                  value={employee.branchID}
                  onChange={(e) =>
                    setEmployee({ ...employee, branchID: e.target.value })
                  }
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Gender:</label>
                <select
                  className="add-input w-full"
                  value={employee.gender}
                  onChange={(e) =>
                    setEmployee({ ...employee, gender: e.target.value })
                  }
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Position:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={employee.position}
                  onChange={(e) =>
                    setEmployee({ ...employee, position: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Hire Date:</label>
                <input
                  className="add-input w-full"
                  type="date"
                  value={employee.hireDate}
                  onChange={(e) =>
                    setEmployee({ ...employee, hireDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Bank Account Number:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={employee.bankAccountNumber}
                  onChange={(e) =>
                    setEmployee({
                      ...employee,
                      bankAccountNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Toolbar className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className="text-btn rounded-md md:px-14 md:hidden block"
                type="submit"
              >
                Add
              </button>
              <button
                className="bg-slate-100 hover:bg-slate-400 text-slate-500 hover:text-white rounded-md md:px-14 py-2 text-center drop-shadow-md border-gray-300 border-1"
                onClick={handleBackButton}
              >
                Back
              </button>
              <button
                className="text-btn rounded-md md:px-14 md:block hidden"
                type="submit"
              >
                Add
              </button>
            </Toolbar>
          </form>
        </div>
      </Toolbar>
    </div>
  );
}

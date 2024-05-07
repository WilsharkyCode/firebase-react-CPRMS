import { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref, push } from "firebase/database";
import BackBtn from "../../components/backBtn";
import { AuthContext } from "../../components/AuthContext";

//Input Patient Details
export default function PatientRecordForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phoneNum, setPhoneNum] = useState(0);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const { dispatch: authDispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const addItems = () => {
    try {
      const itemId = new Date().getTime().toString();
      set(ref(database, "patients/" + itemId), {
        firstName,
        lastName,
        middleInitial,
        birthday,
        age,
        phoneNum,
        email,
      });

      navigate("/");
    } catch (error) {
      console.error("Error adding document ");
    }
  };

  const SignOutDispatch = useCallback(() => {
    authDispatch({ type: "LOGOUT" });
    console.log("LogOut dispatch Successful");
  }, [authDispatch]);

  return (
    <>
      {/*Header Container Start*/}
      <div className=" flex justify-center bg-slate-100 drop-shadow-md ">
        <div className="bg-slate-100 flex items-baseline p-2">
          <h5 class="h5 text-pastelpurple font-semibold mr-96">
            ALADANA DENTAL CLINIC
          </h5>

          <button className="bg-slate-50 hover:bg-slate-200 px-4 py-2 drop-shadow-md mr-2 rounded-sm ">
            Birthdays
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={SignOutDispatch}
          >
            Logout
          </button>
        </div>
      </div>
      {/*Header Container End*/}
      <div className="record-container bg-slate-200 h-screen">
        <form className="bg-slate-100 drop-shadow-lg" onSubmit={addItems}>
          <h3 className="h3">Enter Patient Data</h3>
          <table>
            <tr>
              <td colSpan={2}>
                <label>First Name:</label>
                <input
                  className="add-input float-right min-w-48"
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
              </td>
              <td colSpan={2}>
                <label>Last Name:</label>
                <input
                  className="add-input float-right min-w-48 "
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label>Middle Initial:</label>
                <input
                  className="add-input float-right min-w-48"
                  type="text"
                  onChange={(e) => setMiddleInitial(e.target.value)}
                  placeholder="Middle Initial"
                  required
                />
              </td>
              <td colSpan={2}>
                <label>Age:</label>
                <input
                  className="add-input float-right min-w-48"
                  type="number"
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label>Birthday:</label>
                <input
                  className="add-input float-right min-w-48"
                  type="date"
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="Birthday"
                />
              </td>
              <td>
                <label>Phone #:</label>
                <input
                  className="add-input float-right min-w-48"
                  type="number"
                  onChange={(e) => setPhoneNum(e.target.value)}
                  placeholder="Phone Num."
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Email:</label>
              </td>
              <td>
                <input
                  className="add-input float-right min-w-48"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </td>
              <td colspan="2">
                <br></br>
              </td>
            </tr>
          </table>
          <div className="mt-4">
            <button className="text-btn float-right" type="submit">
              Create Patient
            </button>
            <BackBtn />
          </div>
        </form>
      </div>
    </>
  );
}

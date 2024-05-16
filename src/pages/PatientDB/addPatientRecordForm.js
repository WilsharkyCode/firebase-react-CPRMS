import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref } from "firebase/database";
import BackBtn from "../../components/backBtn";
import { AuthContext } from "../../components/AuthContext";
import CustomHeader from "../../components/CustomHeader";

//Input Patient Details
export default function PatientRecordForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phoneNum, setPhoneNum] = useState(0);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);

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

  return (
    <>
      <CustomHeader />

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

          {/*Form Options*/}
          <div className="mt-4">
            <button className="text-btn float-right" type="submit">
              Create Patient
            </button>
            <BackBtn />
          </div>
          {/*Form Options*/}
        </form>
      </div>
    </>
  );
}

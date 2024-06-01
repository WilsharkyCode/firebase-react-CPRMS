import { useContext, useEffect, useState, useCallback } from "react";
import { RecordContext } from "../../components/RecordContext";
import { AuthContext } from "../../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { onValue, ref } from "firebase/database";
import TreatmentDTable from "./TreatmentDTable";

export function TreatmentRecord() {
  //Copy from DataTable the logic for this
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  //For Cached JSON patientData struc
  const [patientData, setPatientData] = useState({
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
  const { dispatch } = useContext(RecordContext);
  const { dispatch: authDispatch } = useContext(AuthContext);

  //Retrieves Cached JSON patientData struc, parses it and posts them to editingItem
  useEffect(() => {
    if ("caches" in window) {
      caches.open("TRPatientData").then((cache) => {
        cache.match("TRPatientData").then((response) => {
          if (response) {
            response.text().then((patientData) => {
              const parsedData = JSON.parse(patientData);
              console.log("Retrieved from cache:", parsedData);
              setPatientData(parsedData);
            });
          } else {
            console.log("Nothing in cache");
          }
        });
      });
    }
  }, []);

  //TR Retriever
  useEffect(() => {
    const itemsRef = ref(database, "TreatmentRecords/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      console.log(snapshot.val());
      const loadedItems = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];

      //retrive loaded items from local
      setData(loadedItems);
    });
  }, []);

  const handleCloseRecord = useCallback(
    (e) => {
      e.preventDefault();
      dispatch({ type: "RETURN_ID" });
      navigate("/");
    },
    [navigate, dispatch]
  );

  const handleAddTR = useCallback(
    (e, id) => {
      e.preventDefault();
      dispatch({ type: "ADD_RECORD", payload: id });
      console.log("UID: ", id, "Dispatched");
      navigate("/addTreatmentRecord");
    },
    [navigate, dispatch]
  );

  //to Filter Keys
  const keys = ["date"];

  //handles search query on data from database
  const handleSearchQuery = (data) => {
    return data?.filter((treatmentRecords) =>
      keys.some((key) =>
        treatmentRecords[key].toLocaleLowerCase().includes(searchQuery)
      )
    );
  };

  //logs out and
  //useCallback prevents function from auto dispatching
  const SignOutDispatch = useCallback(() => {
    authDispatch({ type: "LOGOUT" });
    console.log("LogOut dispatch Successful");
  }, [authDispatch]);

  return (
    <>
      <div className="bg-slate-100 h-dvh">
        {/*Header Container Start*/}
        <div className=" flex justify-center bg-slate-100 drop-shadow-md ">
          <div className="bg-slate-100 flex items-baseline p-2 ">
            <h5 class="h5 text-pastelpurple font-semibold">
              ALADANA DENTAL CLINIC
            </h5>
            <form className=" mx-24 ">
              <input
                type="text"
                placeholder="Search Name"
                className="bg-slate-200 w-96 p-1 rounded-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/*<button className='search-btn' type="submit" disabled>Search</button>*/}
            </form>
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

        <div className="page-container">
          <div className="container">
            <button
              className="float-left bg-slate-200 p-2"
              onClick={handleCloseRecord}
            >
              Close
            </button>
          </div>
          <br />
          <br />

          <div className="page-header-container">
            <h3 className="h4  database-title">TREATMENT RECORDS:</h3>
            <button
              onClick={() => navigate("/recordform")}
              className=" open-add-form-btn"
            >
              ADD NEW RECORD
            </button>
          </div>

          <br />
          <br />
          <br />

          <div className="container">
            <div>
              <b>PATIENT DETAILS:</b>
              <p className="float-right">{patientData.id}</p>
            </div>
            <table className="">
              <tr>
                <td>
                  <div>{patientData.firstName}</div>
                </td>
                <td>
                  <div>{patientData.lastName}</div>
                </td>
                <td>
                  <div>{patientData.middleInitial}</div>
                </td>
                <td>
                  <div>{patientData.age}</div>
                </td>
                <td>
                  <div>{patientData.email}</div>
                </td>
                <td>
                  <div>{patientData.birthday}</div>
                </td>
              </tr>
            </table>
          </div>

          {/*Sends data from firebase and setSearchQuery*/}
          <TreatmentDTable
            data={handleSearchQuery(data)}
            patientid={patientData.id}
          />
        </div>
      </div>
    </>
  );
}

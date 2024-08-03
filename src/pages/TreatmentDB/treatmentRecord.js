import { useContext, useEffect, useState, useCallback } from "react";
import { RecordContext } from "../../components/RecordContext";
import { AuthContext } from "../../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { onValue, ref } from "firebase/database";
import TreatmentDTable from "./TreatmentDTable";
import BackIcon from "../../components/Icons/arrow-left-purple.png";
import CustomHeader from "../../components/CustomHeader";

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
      <div className="bg-slate-100 h-dvh overflow-x-hidden">
        <div className="lg:hidden contents">
          <CustomHeader />
        </div>

        {/*Header Container Start*/}
        <div className=" lg:flex hidden justify-center bg-slate-100 drop-shadow-md ">
          <div className="bg-slate-100 flex items-baseline p-2 ">
            {/*Disappear*/}
            <h5 class="h5 text-pastelpurple font-semibold ">
              ALADANA DENTAL CLINIC
            </h5>
            <form className="mx-24">
              <input
                type="text"
                placeholder="Search Record Date..."
                className="bg-slate-200 w-96 p-1 rounded-sm "
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

        {/*Title Container Start*/}
        <div className="page-container ">
          <div className="page-header-container md:mb-8 ">
            {/*Close Record Button*/}
            <button
              className="float-left bg-slate-50 p-2 rounded-md
              transition duration-400 ease-in-out
               hover:bg-slate-200 drop-shadow-sm text-pastelpurple
              border-slate-200 border flex align-baseline"
              onClick={handleCloseRecord}
            >
              <img src={BackIcon} alt="Back" width="26px" height="26px" />
              <b> PATIENT DIRECTORY</b>
            </button>
            {/*Close Record Button*/}

            <br />
            <br />
            <br />

            <h5 className="h5 database-title contents lg:hidden">
              TREATMENT RECORDS:
              <br />
            </h5>

            <h3 className="h4 database-title lg:contents hidden">
              TREATMENT RECORDS:
            </h3>
            <button
              onClick={(e) => handleAddTR(e, patientData.id)}
              className=" open-add-form-btn"
            >
              ADD NEW RECORD
            </button>
          </div>
          <br />
          {/*Title Container End*/}

          <div className=" container w-75 lg:w-48 justify-center lg:flex hidden">
            <div
              className=" border drop-shadow-md block bg-slate-100 p-6 m-6 
            lg:patient-details-container-lg xl:patient-details-container-xl"
            >
              <div>
                <b>PATIENT DETAILS:</b>
                <p className="float-right">ID: {patientData.id}</p>
              </div>

              <table className="table-auto ">
                <tr className="flex items-baseline p-1">
                  <td className="w-80 " colSpan={2}>
                    <b className="text-wrap">FIRST NAME:</b>
                    <p className="patient-details-cell">
                      {patientData.firstName}
                    </p>
                  </td>
                  <td className="w-80 xl:w-96  " colSpan={2}>
                    <b>MIDDLE NAME:</b>
                    <p className="patient-details-cell">
                      {patientData.middleInitial}
                    </p>
                  </td>
                  <td className="flex items-baseline " colSpan={2}>
                    <b>LAST NAME:</b>
                    <p className="patient-details-cell">
                      {patientData.lastName}
                    </p>
                  </td>
                  <td className="flex items-baseline ">
                    <b>AGE:</b>
                    <p className="mx-1 min-w-12 px-2 py-1 bg-slate-200 rounded-lg ">
                      {patientData.age}
                    </p>
                  </td>
                </tr>

                <tr className="flex items-baseline p-1">
                  <td className="w-80 " colSpan={2}>
                    <b>EMAIL:</b>
                    <p className="patient-details-cell">{patientData.email}</p>
                  </td>
                  <td className="w-80 xl:w-96 " colSpan={2}>
                    <b>BIRTHDAY:</b>
                    <p className="patient-details-cell">
                      {patientData.birthday}
                    </p>
                  </td>
                  <td className="" colSpan={2}>
                    <b>PHONE#: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                    <p className="patient-details-cell">
                      {patientData.phoneNum}
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          {/*Sends data from firebase and setSearchQuery*/}
          <div className="md:scale-100 scale-75  overflow-x-auto">
            <TreatmentDTable
              data={handleSearchQuery(data)}
              patientid={patientData.id}
            />
          </div>
        </div>
      </div>
    </>
  );
}

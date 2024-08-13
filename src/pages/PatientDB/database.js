import { useState, useEffect, useContext, useCallback } from "react";
import "./database.css";
import SignOutBtn from "../../components/SignOutBtn";
import DataTable from "../../components/DataTable";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { ref, onValue } from "firebase/database";
import CustomHeader from "../../components/CustomHeader";
export default function Database() {
  const [data, setData] = useState([]);
  const [dataRecords, setRecordData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const Nav = useNavigate();

  //to Filter Keys
  const keys = ["firstName", "lastName"];

  //Read
  //Run Once
  useEffect(() => {
    const itemsRef = ref(database, "patients/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedItems = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];

      //export loaded items from local func to main Func
      setData(loadedItems);
    });
  }, []);

  useEffect(() => {
    const itemsRef = ref(database, "TreatmentRecords/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedItems = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];

      //export loaded items from local func to main Func
      setRecordData(loadedItems);
    });
  }, []);

  //handles search query on data from database
  const handleSearchQuery = (data) => {
    return data?.filter((patient) =>
      keys.some((key) => patient[key].toLocaleLowerCase().includes(searchQuery))
    );
  };

  return (
    <div className="bg-slate-100 h-dvh overflow-x-hidden">
      <div className="lg:hidden contents">
        <CustomHeader />
      </div>
      {/*Header Container Start*/}
      <div className="lg:flex hidden  justify-center bg-slate-100 drop-shadow-md ">
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
          <SignOutBtn />
        </div>
      </div>
      {/*Header Container End*/}

      <div className="page-container ">
        <div className="page-header-container ">
          <h4 className="h4 database-title lg:contents hidden">
            PATIENT DIRECTORY:
          </h4>
          <h5 className="h5 database-title contents lg:hidden">
            TREATMENT RECORDS:
            <br />
          </h5>

          <button
            onClick={() => Nav("/recordform")}
            className="open-add-form-btn"
          >
            ADD NEW PATIENT
          </button>
        </div>

        <div className="md:contents hidden">
          <br />
          <br />
        </div>
        {/*Sends data from firebase and setSearchQuery*/}
        <div className="md:scale-100 scale-90 overflow-x-auto ">
          <DataTable data={handleSearchQuery(data)} dataRecords={dataRecords} />
        </div>
      </div>
    </div>
  );
}

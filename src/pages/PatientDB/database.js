import { useState, useEffect, useContext, useCallback } from "react";
import "./database.css";
import { AuthContext } from "../../components/AuthContext";
import DataTable from "../../components/DataTable";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { ref, onValue } from "firebase/database";

export default function Database() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { dispatch: authDispatch } = useContext(AuthContext);

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

  //logs out and
  //useCallback prevents function from auto dispatching
  const SignOutDispatch = useCallback(() => {
    authDispatch({ type: "LOGOUT" });
    console.log("LogOut dispatch Successful");
  }, [authDispatch]);

  //handles search query on data from database
  const handleSearchQuery = (data) => {
    return data?.filter((patient) =>
      keys.some((key) => patient[key].toLocaleLowerCase().includes(searchQuery))
    );
  };

  return (
    <div className="database-container">
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

      <div className="p-8 bg-slate-100">
        <div className="flex justify-between">
          <h3 className="h4 text-pastelpurple">PATIENT DIRECTORY:</h3>
          <button
            onClick={() => Nav("/recordform")}
            className="bg-pastelpurple hover:bg-violet-800 text-white rounded-sm px-4 py-2 text-center m-2"
          >
            ADD NEW PATIENT
          </button>
        </div>

        {/*Sends data from firebase and setSearchQuery*/}
        <DataTable data={handleSearchQuery(data)} />
      </div>
    </div>
  );
}


import { useState, useEffect, useContext, useCallback } from "react";
import "./database.css";
import { AuthContext } from "../../components/AuthContext";
import DataTable from '../../components/DataTable';
import { useNavigate } from 'react-router-dom';
import { database } from "../../config/firebase-config";
import { ref, onValue } from "firebase/database";




export default function Database() {
  const [data,setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {dispatch:authDispatch} = useContext(AuthContext);

  const Nav = useNavigate();
  
  //to Filter Keys
  const keys = ["firstName","lastName"];

    //Read
    //Run Once
    useEffect(() => {
      const itemsRef = ref(database, 'patients/');
      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedItems = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
  
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
    const handleSearchQuery = (data) =>{
      return data?.filter((patient) => 
        keys.some((key) => patient[key].toLocaleLowerCase().includes(searchQuery))
      )
    };



  return (
    <div className='database-container' >
      <div className='top-nav'>
        <h5>Aldana Dental Clinic</h5>

        <form className='search-container'>
          <input type='text' 
          placeholder='Search Name' 
          className='basic-search-bar'
          onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/*<button className='search-btn' type="submit" disabled>Search</button>*/}
          
        </form>
          <button className='flex-left' onClick={SignOutDispatch}>Logout</button>
      </div>

      <div className='display-container'>
        <div className='top-container'>
          <h3>Patient Lists:</h3> 
          <button onClick={() =>Nav("/recordform")}  
            className='add-patient-btn'>
            Add Patient
          </button>
          </div>
          
          {/*Sends data from firebase and setSearchQuery*/}
          <DataTable data={handleSearchQuery(data)}/>
     
        </div>

      
    </div>
  )
}

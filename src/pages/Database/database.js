import React, { useContext } from 'react'
import { collection, getDocs } from "firebase/firestore"; 
import { useState, useEffect } from "react";
import { db } from '../../config/firebase-config';
import "./database.css"
import { RecordContext } from '../../components/RecordContext';
import DataTable from '../../components/DataTable';
import { useNavigate } from 'react-router-dom';




export default function Database() {
  const [data,setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {dispatch, patientUID} = useContext(RecordContext);
  const Navigate = useNavigate();
  
  console.log(patientUID)

    let list=[];
    //Run Once
    useEffect(() => {
        const DataFetch = async () =>{
            try {
                const querySnapshot = await getDocs(collection(db, "patients"));
                querySnapshot.forEach((doc) => {
                //input arr to list arr = firebaseDB doc
                list.push({id:doc.id, ...doc.data()});
                });
                //init "list" arr to setdata
                setData(list);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
         //run func
         DataFetch();
    }, []);

    
    
  return (

    <div className='database-container' >
      <header>
        <input type='text' 
        placeholder='Search Name' 
        className='basic-search-bar'
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type='submit'>Search</button>
        <br/>
      </header>

      <div className='display-container'>
        <div className='top-container'>
          <h3>Patient Lists:</h3> 
          <button onClick={() =>Navigate("/recordform")}  
          className='add-patient-btn'>
            Add Patient
          </button>
        </div>
        
        <DataTable data={data}/>
        {/* 
        <div className='data-sheet-container'>
          <b className='table-header-span2'>Patient ID</b>
          <b className='table-header'>Name:</b>
          <b className='table-header'>Last Name:</b>
          <b className='table-header'>Middle Initial</b>
          <div className='table-header'>Actions:</div>

          {data.filter((lists) =>
          lists.firstName.toLowerCase().includes(searchQuery)
          ).map((lists) => (
            <div key={lists.id}>
              <div className='span-2' >{lists.id}</div>
              <div className='data-item'>{lists.lastName}</div>
              <div className='data-item'>{lists.lastName}</div>
              <div className='data-item'>{lists.middleInitial}</div>

              <div className='option-container'>
                <button className='options' 
                onClick={() => dispatch({type:"OPEN_RECORD", payload: lists.id})}>
                  Open Treatment Record
                </button>
                <br/>
                <button className='options'>View Additional Data</button>
              </div>

            </div>))}
        </div>
          */}
      </div>

      
    </div>
  )
}

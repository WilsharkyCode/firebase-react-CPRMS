import React, { useCallback, useContext, useState } from 'react'
import { RecordContext } from './RecordContext';
import { useNavigate } from 'react-router-dom';
import { ref, remove } from 'firebase/database';
import { database } from '../config/firebase-config';


//Data table, Search query module
export default function DataTable({data}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const navigate = useNavigate();

  //Func to Open Treatment record and send patientData
  //handles data transfer 
  const cachepatientData = useCallback((patientData) => {
    const parsedData = JSON.stringify(patientData);
    if ('caches' in window) {
      caches.open("TRPatientData").then(cache => {
        cache.put("TRPatientData", new Response(parsedData));
        console.log(parsedData);
      });
    }
  },[]);
    //Targeting system for patientData to edit and nav
    //calls cachepatientData func
  const getPatientDetails = useCallback((e, patientData) => {
    e.preventDefault();
    cachepatientData(patientData);
    console.log('Caching success');
    navigate("/treatment");
  }, [navigate, cachepatientData]);



  //deletes Item form DB, callback to not auto trigger the function
  const deleteRecords = useCallback((id) => {
    remove(ref(database, 'patients/' + id));
    console.log("Delete Success");
  },[]);

    //handles data transfer 
  const storeInCache = useCallback((patientData) => {
    const parsedData = JSON.stringify(patientData);
    if ('caches' in window) {
      caches.open("PatientData").then(cache => {
        cache.put("PatientData", new Response(parsedData));
        console.log(parsedData);
      });
    }
  },[]);
   //Targeting system for patientData to edit and nav
   //calls storeInCache func
  const startEditing = useCallback((e, patientData) => {
    e.preventDefault();
    storeInCache(patientData);
    console.log('Caching success');
    navigate("/editrecordform");
  }, [navigate, storeInCache]);
     


  return (
    <div className='center-container'>
      <table className='data-sheet-container'>
        <thead>
            <tr>
                <th className='table-header-center' colspan="2">Patient UID</th>
                <th className='table-header' colspan="2">First Name</th>
                <th className='table-header'>Last Name</th>
                <th className='table-header'>Middle Initial</th>
                <th className='table-header'>ACTIONS</th>
            </tr>
        </thead>
        <tbody>
          {/*data is renamed as patient and index is a number counter*/}
          {data.slice(indexOfFirstItem, indexOfLastItem).map((patient) => (
            <tr key={patient.id} >
              <td className='cell-center' colspan="2">{patient.id}</td>
              <td className='data-cell' colspan="2">{patient.firstName}</td>
              <td className='data-cell'>{patient.lastName}</td>
              <td className='data-cell'>{patient.middleInitial}</td>

              <td className='option-container'>
                <button  className='options'
                  onClick={(e) => getPatientDetails(e, patient)}>
                    Open Treatment Record
                </button>
                <br/>
                <button className='options' onClick={(e) => startEditing(e, patient)}>Edit</button>
                <button className='options' onClick={() => deleteRecords(patient.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className='add-patient-btn' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
        </span>
        <button className='add-patient-btn' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
          Next
        </button>
      </div>
  </div>
  )
}
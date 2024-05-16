import React, { useCallback,  useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ref, remove } from 'firebase/database';
import { database } from '../../config/firebase-config';


//Data table, Search query module
export default function TreatmentDTable({data, patientid}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const navigate = useNavigate();




  //deletes Item form DB, callback to not auto trigger the function
  const deleteRecords = useCallback((id) => {
    remove(ref(database, 'TreatmentRecords/' + id));
    console.log("Delete Success");
  },[]);

 
    //Cache Module for Editing 
    //handles data transfer 
  const storeInCache = useCallback((TreatmentRecordData) => {
    const parsedData = JSON.stringify(TreatmentRecordData);
    if ('caches' in window) {
      caches.open("TreatmentRecordData").then(cache => {
        cache.put("TreatmentRecordData", new Response(parsedData));
        console.log(parsedData);
      });
    }
  },[]);
  
   //Targeting system for patientData to edit and nav
   //calls storeInCache func
  const startEditing = useCallback((e, treatmentRecords) => {
    e.preventDefault();
    storeInCache(treatmentRecords);
    console.log('Caching success');
    navigate("/edittreatmentrecord");
  }, [navigate, storeInCache]);
     


  return (
    <div className='center-container'>
      <table className='data-sheet-container'>
        <thead>
            <tr>
                <th className='table-header-center' >Date</th>
                <th className='table-header' colspan="3">Procedure</th>
                <th className='table-header'>Amount Paid</th>
                <th className='table-header'>Balance</th>
                <th className='table-header'>ACTIONS</th>
            </tr>
        </thead>
        <tbody>
          {/*data is renamed as patient and index is a number counter*/}
        {data.sort((a, b) => new Date(b.date) - new Date(a.date))
          .filter((treatmentRecords) => 
            treatmentRecords.patientID && treatmentRecords.patientID.includes(patientid)
            ).slice(indexOfFirstItem, indexOfLastItem).map((treatmentRecords) => (
                <tr key={treatmentRecords.id} >
                  <td className='cell-center'>{treatmentRecords.date}</td>
                  <td className='data-cell' colspan="3">{treatmentRecords.procedure}</td>
                  <td className='data-cell'>{treatmentRecords.amountPaid}</td>
                  <td className='data-cell'>{treatmentRecords.balance}</td>
                  <td className='option-container'>
                    <button className='options' onClick={(e) => startEditing(e, treatmentRecords)}>Edit</button>
                    <button className='options' onClick={() => deleteRecords(treatmentRecords.id)}>Delete</button>
                  </td>
                </tr>
            ))
        }
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
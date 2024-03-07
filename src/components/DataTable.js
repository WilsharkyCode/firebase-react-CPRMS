import React, { useCallback, useContext, useState } from 'react'
import { RecordContext } from './RecordContext';
import { useNavigate } from 'react-router-dom';


//Data table, Search query module
export default function DataTable({data}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;



  const {dispatch} = useContext(RecordContext);
  const navigate = useNavigate();

  //Func to Open Treatment record and dispatch UIDs
  const patientUIDDispatch = useCallback((e,id) => {
    e.preventDefault();
    dispatch({ type: 'OPEN_RECORD', payload: id });
    console.log('dispatch success');
    navigate("/treatment");
  }, [navigate, dispatch]);

    

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
                onClick={(e) => patientUIDDispatch(e, patient.id)}>
                  Open Treatment Record
                </button>
                <br/>
                <button className='options'>Delete</button>
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
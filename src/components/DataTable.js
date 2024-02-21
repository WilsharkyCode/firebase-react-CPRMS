import React, { useCallback, useContext } from 'react'
import { RecordContext } from './RecordContext';
import { useNavigate } from 'react-router-dom';



export default function DataTable({data}) {

  const {dispatch} = useContext(RecordContext);
  const navigate = useNavigate();

  const patientUIDDispatch = useCallback((e,id) => {
    e.preventDefault();
    dispatch({ type: 'OPEN_RECORD', payload: id });
    console.log('dispatch success');
    navigate("/treatment");
  }, [navigate, dispatch]);

    

  return (
    <table className='data-sheet-container'>
    <thead>
        <tr>
            <th className='table-header-center' colspan="2">Index</th>
            <th className='table-header' colspan="2">First Name</th>
            <th className='table-header'>Last Name</th>
            <th className='table-header'>Middle Initial</th>
            <th className='table-header'>ACTIONS</th>
        </tr>
    </thead>
    <tbody>
      {data.map((lists, index) => (
        <tr key={lists.id} >
          <td className='cell-center' colspan="2">{index}</td>
          <td className='data-cell' colspan="2">{lists.firstName}</td>
          <td className='data-cell'>{lists.lastName}</td>
          <td className='data-cell'>{lists.middleInitial}</td>
          <td className='option-container'>
          <button  className='options'
            onClick={(e) => patientUIDDispatch(e, lists.id)}>
              Open Treatment Record
            </button>
            <br/>
            <button className='options'>View Additional Data</button>
          </td>
        </tr>
      ))}
    </tbody>
</table>
  )
}
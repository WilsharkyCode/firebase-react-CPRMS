import React, { useContext, useState } from 'react'
import { RecordContext } from './RecordContext';



export default function DataTable({data,searchQuery}) {

  const {dispatch, patientUID} = useContext(RecordContext);


  return (
    <table className='data-sheet-container'>
    <thead>
        <tr>
            <th className='table-header-center' colspan="2">Index</th>
            <th className='table-header' colSpan="2">First Name</th>
            <th className='table-header'>Last Name</th>
            <th className='table-header'>Middle Initial</th>
            <th className='table-header'>ACTIONS</th>
        </tr>
    </thead>
    <tbody>
      {data.map((lists, index) => (
        <tr key={lists.id} >
          <td className='cell-center' colSpan="2">{index}</td>
          <td className='data-cell' colSpan="2">{lists.firstName}</td>
          <td className='data-cell'>{lists.lastName}</td>
          <td className='data-cell'>{lists.middleInitial}</td>
          <td className='option-container'>
            <button  className='options'
            onClick={() => dispatch({type:"OPEN_RECORD", payload: lists.id})}>
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
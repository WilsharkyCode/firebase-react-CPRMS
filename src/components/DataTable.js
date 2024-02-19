import React, { useContext, useState } from 'react'
import { RecordContext } from './RecordContext';



export default function DataTable({data,searchQuery}) {

  const {dispatch, patientUID} = useContext(RecordContext);


  return (
    <table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
        </tr>
    </thead>
    <tbody>
      {data.map((lists, index) => (
        <tr key={lists.id} >
          <td>{index}</td>
          <td>{lists.firstName}</td>
          <td>{lists.lastName}</td>
          <td>{lists.middleInitial}</td>
          <td >
            <button  
            onClick={() => dispatch({type:"OPEN_RECORD", payload: lists.id})}>
              Open Treatment Record
            </button>
            <br/>
            <button >View Additional Data</button>
          </td>
        </tr>
      ))}
    </tbody>
</table>
  )
}
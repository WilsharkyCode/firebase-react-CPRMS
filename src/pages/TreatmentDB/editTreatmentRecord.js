import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref } from "firebase/database";


export default function EditTreatmentRecord(){
    const navigate = useNavigate();
    const [editingItem, setEditingItem] = useState({
        id: null,
        patientID: "",
        date: "",
        procedure: "",
        amountPaid: 0,
        balance: 0
        });
    //Retrieves Cached ID and Post them to editingItem
    useEffect(() => {
        if ('caches' in window) {
            caches.open("TreatmentRecordData").then(cache => {
              cache.match("TreatmentRecordData").then(response => {
                if (response) {
                  response.text().then(TreatmentRecord => {
                    const parsedData = JSON.parse(TreatmentRecord)
                    console.log('Retrieved from cache:', parsedData);
                    setEditingItem(parsedData);
                  });
                } else {
                  console.log('Nothing in cache');
                }
              });
            });
          }
    }, []);

    //OnClick, Updates Patient Details
    const editItems = () => {
        try {
            set(ref(database, 'TreatmentRecords/' + editingItem.id), {
                patientID: editingItem.patientID,
                date: editingItem.date,
                procedure: editingItem.procedure,
                amountPaid: editingItem.amountPaid,
                balance: editingItem.balance
              });
            navigate("/treatment")   
        } catch (error) {
            console.error("Error adding document ");
        }
      };

      const handleBackButton = useCallback (() => {
        navigate('/treatment');
    },[navigate]);


    return(
        <>
        <div className="record-container" >
            <form onSubmit={editItems}>
                <h3>Edit Treatment Record Data</h3>
                <table>
                    <tr>
                        {/*Invisible, Just for targeting of */}
                        <input 
                        type="text" 
                        value={editingItem.id}
                        onChange={e => setEditingItem(prev => ({ ...prev, id: e.target.value }))} 
                        required hidden/>
                        <input 
                        type="text" 
                        value={editingItem.patientID}
                        onChange={e => setEditingItem(prev => ({ ...prev, patientID: e.target.value }))} 
                        required hidden/>

                        
                        <td><label>Date:</label></td>
                        <td><input 
                        type="date" 
                        value={editingItem.date}
                        onChange={e => setEditingItem(prev => ({ ...prev, date: e.target.value }))} 
                        placeholder="Enter Date of Transaction" 
                        required/>
                        </td>
                        <td><label>Procedure:</label></td>
                        <td><input 
                        type="text"
                        value={editingItem.procedure}
                        onChange={e => setEditingItem(prev => ({ ...prev, procedure: e.target.value }))} 
                        placeholder="Enter Procedure" required/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Amount Paid:</label></td>
                        <td><input 
                        type="text" 
                        value={editingItem.amountPaid}
                        onChange={e => setEditingItem(prev => ({ ...prev, amountPaid: e.target.value }))} 
                        placeholder="Amount Paid" required/>
                        </td>
                        <td><label>Balance:</label></td>
                        <td><input 
                        type="number"
                        value={editingItem.balance} 
                        onChange={e => setEditingItem(prev => ({ ...prev, balance: e.target.value }))} 
                        placeholder="Balance"/>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <button type="submit">Save Treatment Record</button>
                        </td>
                    </tr>
                </table>
            
                <button onClick={handleBackButton}>Back to Treatment Record Database</button>
            </form>
            
        </div>

        </>
    )
}
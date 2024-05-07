import { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref, push } from "firebase/database";
import { RecordContext } from "../../components/RecordContext";

export default function AddTreatmentRecord(){
    const navigate = useNavigate();
    const {patientUID} = useContext(RecordContext);
    const [addItem,setAddItem] = useState({
        date: "",
        procedure: "",
        amountPaid: 0,
        balance: 0
    });


    //AutoGenerates ID then add
    const addItems = () => {
        try {
            const TRRef = ref(database, 'TreatmentRecords/'); //Directory
            const NewTRRef = push(TRRef); //IDGenerator
            set(NewTRRef,{
                patientID: patientUID,
                date: addItem.date,
                procedure: addItem.procedure,
                amountPaid: addItem.amountPaid,
                balance: addItem.balance
            });
            navigate("/treatment");   
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
            <form onSubmit={addItems}>
                <h3>Enter Treatment Record Data</h3>
                <table>
                    
                    <tr>
                        <td><label>Date:</label></td>
                        <td><input 
                        type="date" 
                        onChange={e=>setAddItem(prev => ({ 
                            ...prev, date: e.target.value 
                        }))} 
                        placeholder="Date" 
                        required/>
                        </td>

                        <td><label>Procedure:</label></td>
                        <td>
                        <textarea 
                        onChange={e=>setAddItem(prev => ({ 
                            ...prev, procedure: e.target.value 
                        }))} 
                        placeholder="Procedure"  
                        rows="4" cols="50" 
                        required/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Amount Paid:</label></td>
                        <td><input 
                        type="number" 
                        onChange={e=>setAddItem(prev => ({ 
                            ...prev, amountPaid: e.target.value 
                        }))} 
                        placeholder="Amount Paid" required/>
                        </td>
                        <td><label>Balance:</label></td>
                        <td><input 
                        type="number" 
                        onChange={e=>setAddItem(prev => ({ 
                            ...prev, balance: e.target.value 
                        }))} 
                        placeholder="Balance" required/> 
                        </td>
                    </tr>
                    
                    <tr>
                        <td colspan="2">
                            <button type="submit">Create Treatment Record</button>
                        </td>
                        <td>
                        <button onClick={handleBackButton}>Back to Treatment Record Database</button>
                        </td>
                        
                    </tr>
                </table>
            </form>
        </div>
        </>
    )
};
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../config/firebase-config";
import { set, ref } from "firebase/database";
import BackBtn from "../components/backBtn";

export default function PatientRecordForm(){
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [middleInitial,setMiddleInitial] = useState("");
    const [birthday,setBirthday] = useState("");
    const [phoneNum,setPhoneNum] = useState(0);
    const [email,setEmail] = useState("");
    const [age,setAge] = useState(0);

    const navigate = useNavigate();

    const addItems = () => {
        try {
            const itemId = new Date().getTime().toString(); 
            set(ref(database, 'patients/' + itemId), {
                firstName,
                lastName,
                middleInitial,
                birthday,
                age,
                phoneNum,
                email,
            });
            navigate("/")   
        } catch (error) {
            console.error("Error adding document ");
        }
        
      };



    return(
        <>
        <div className="record-container" >
            <form onSubmit={addItems}>
                <h3>Enter Patient Data</h3>
                <table>
                    <tr>
                        <td><label>First Name:</label></td>
                        <td><input 
                        type="text" 
                        onChange={e=>setFirstName(e.target.value)} 
                        placeholder="First Name" required/>
                        </td>
                        <td><label>Last Name:</label></td>
                        <td><input 
                        type="text" 
                        onChange={e=>setLastName(e.target.value)} 
                        placeholder="Last Name" required/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Middle Initial:</label></td>
                        <td><input 
                        type="text" 
                        onChange={e=>setMiddleInitial(e.target.value)} 
                        placeholder="Middle Initial" required/>
                        </td>
                        <td><label>Age:</label></td>
                        <td><input 
                        type="number" 
                        onChange={e=>setAge(e.target.value)} 
                        placeholder="Age"/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Birthday:</label></td>
                        <td><input 
                        type="date" 
                        onChange={e=>setBirthday(e.target.value)} 
                        placeholder="Birthday"/>
                        </td>
                        <td><label>Phone #:</label></td>
                        <td><input 
                        type="number" 
                        onChange={e=>setPhoneNum(e.target.value)} 
                        placeholder="Phone Num."/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Email:</label></td>
                        <td><input 
                        type="email" 
                        onChange={e=>setEmail(e.target.value)} 
                        placeholder="Email"/>
                        </td>
                        <td colspan="2"></td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <button type="submit">Create Patient</button>
                        </td>
                    </tr>
                </table>
                <BackBtn/>
            </form>
            
        </div>
        
            
            
            
            
            
           
            
            
        
        </>
    )

}
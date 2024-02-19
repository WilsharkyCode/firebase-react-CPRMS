import { useState } from "react";
import * as BS from "react-bootstrap";
import { collection, addDoc, Timestamp } from "firebase/firestore"; 
import { db } from "../config/firebase-config";
import { useNavigate } from "react-router-dom";


export default function PatientRecordForm(){
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [middleInitial,setMiddleInitial] = useState("");
    const [birthday,setBirthday] = useState("");
    const [phoneNum,setPhoneNum] = useState(0);
    const [email,setEmail] = useState("");
    const [age,setAge] = useState(0);

    const navigate = useNavigate();


    const handleData = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "patients"), {
              firstName,
              lastName,
              middleInitial,
              birthday,
              age,
              phoneNum,
              email,
            });
        
            console.log("Document written with ID: ", docRef.id);
            navigate("/");
        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }




    //autocompute age = current year - birthday year
    //if (currentMM-birthMM || currentDD - birthDD < 0){ age - 1};

    //birthday notif
    //if (currentMM == birthMM && currentDD == birthDD){alert birthday, emoji on name};
    return(
        <>
        <div className="record-container" >
            <form onSubmit={handleData}>
                <p>hello record</p>
                    <BS.Row>
                        <div class="col-xl-2 p-4">
                            <label >First Name:</label>
                            <input type="text" 
                            onChange={e=>setFirstName(e.target.value)} 
                            placeholder="First Name"
                            required></input>
                        </div>
                        <div class="col-xl-2 p-4">
                            <label >Last Name:</label>
                            <input type="text" 
                            onChange={e=>setLastName(e.target.value)} 
                            placeholder="Last Name"
                            required></input>
                        </div>
                        <div class="col-xl-2 p-4">
                            <label >Middle Initial:</label>
                            <input type="text" 
                            onChange={e=>setMiddleInitial(e.target.value)} 
                            placeholder="Middle Initial"
                            required></input>
                        </div>
                        <div class="col-xl-2 p-4">
                            <label >Age:</label><br/>
                            <input type="number" 
                            onChange={e=>setAge(e.target.value)} 
                            placeholder="Age"></input>
                        </div>
                    </BS.Row>
                    <BS.Row>
                        <div class="col-xl-2 p-4">
                            <label >Birthday:</label>
                            <input type="date" 
                            onChange={e=>setBirthday(e.target.value)} 
                            placeholder="Birthday"></input>
                        </div>
                        <div class="col-xl-2 p-4">
                            <label >Phone #:</label>
                            <input type="number" 
                            onChange={e=>setPhoneNum(e.target.value)} 
                            placeholder="Phone Num."></input>
                        </div>
                        <div class="col-xl-2 p-4">
                            <label >Email:</label>
                            <input type="email" 
                            onChange={e=>setEmail(e.target.value)} 
                            placeholder="Email"></input>
                        </div>
                        <div class="col-xl-3 p-3">
                            <p></p>
                        </div>
                    </BS.Row>
                    
                        
                    <BS.Button type="submit">Create Patient</BS.Button>
            </form>
        </div>
        
            
            
            
            
            
           
            
            
        
        </>
    )

}
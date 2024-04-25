
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref } from "firebase/database";
import BackBtn from "../../components/backBtn";

//Input Patient Details
export default function EditPatientRecordForm(){
    const navigate = useNavigate();
    const [editingItem, setEditingItem] = useState({
        id: null, 
        firstName:"",
        lastName:"",
        middleInitial:"",
        birthday:"",
        age:"",
        phoneNum:"",
        email:"",
        });
    //Retrieves Cached ID and Post them to editingItem
    useEffect(() => {
        if ('caches' in window) {
            caches.open("PatientData").then(cache => {
              cache.match("PatientData").then(response => {
                if (response) {
                  response.text().then(id => {
                    const parsedData = JSON.parse(id)
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
            set(ref(database, 'patients/' + editingItem.id), {
                firstName:editingItem.firstName,
                lastName:editingItem.lastName,
                middleInitial:editingItem.middleInitial,
                birthday:editingItem.birthday,
                age:editingItem.age,
                phoneNum:editingItem.phoneNum,
                email:editingItem.email,
              });
            navigate("/")   
        } catch (error) {
            console.error("Error adding document ");
        }
      };


    return(
        <>
        <div className="record-container" >
            <form onSubmit={editItems}>
                <h3>Edit Patient Data</h3>
                <table>
                    <tr>
                        {/*Invisible, Just for targeting of */}
                        <input 
                        type="text" 
                        value={editingItem.id}
                        onChange={e => setEditingItem(prev => ({ ...prev, id: e.target.value }))} 
                        placeholder="First Name" 
                        required hidden/>

                        
                        <td><label>First Name:</label></td>
                        <td><input 
                        type="text" 
                        value={editingItem.firstName}
                        onChange={e => setEditingItem(prev => ({ ...prev, firstName: e.target.value }))} 
                        placeholder="First Name" 
                        required/>
                        </td>
                        <td><label>Last Name:</label></td>
                        <td><input 
                        type="text"
                        value={editingItem.lastName}
                        onChange={e => setEditingItem(prev => ({ ...prev, lastName: e.target.value }))} 
                        placeholder="Last Name" required/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Middle Initial:</label></td>
                        <td><input 
                        type="text" 
                        value={editingItem.middleInitial}
                        onChange={e => setEditingItem(prev => ({ ...prev, middleInitial: e.target.value }))} 
                        placeholder="Middle Initial" required/>
                        </td>
                        <td><label>Age:</label></td>
                        <td><input 
                        type="number"
                        value={editingItem.age} 
                        onChange={e => setEditingItem(prev => ({ ...prev, age: e.target.value }))} 
                        placeholder="Age"/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Birthday:</label></td>
                        <td><input 
                        type="date"
                        value={editingItem.birthday} 
                        onChange={e => setEditingItem(prev => ({ ...prev, birthday: e.target.value }))} 
                        placeholder="Birthday"/>
                        </td>
                        <td><label>Phone #:</label></td>
                        <td><input 
                        type="number"
                        value={editingItem.phoneNum} 
                        onChange={e => setEditingItem(prev => ({ ...prev, phoneNum: e.target.value }))} 
                        placeholder="Phone Num."/>
                        </td>
                    </tr>
                    <tr>
                        <td><label>Email:</label></td>
                        <td><input 
                        type="email"
                        value={editingItem.email}  
                        onChange={e => setEditingItem(prev => ({ ...prev, email: e.target.value }))} 
                        placeholder="Email"/>
                        </td>
                        <td colspan="2"></td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <button type="submit">Save Patient Data</button>
                        </td>
                    </tr>
                </table>
            
                <BackBtn/>
            </form>
            
        </div>

        </>
    )

}
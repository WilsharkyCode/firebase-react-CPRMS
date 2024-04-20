import { useContext, useEffect, useState, useCallback } from "react";
import { RecordContext } from "../components/RecordContext";
import { useNavigate } from "react-router-dom";
import { database } from "../config/firebase-config";
import { onValue, ref } from "firebase/database";

export function TreatmentRecord(){
  const [data,setData] = useState([]);
    const [patientData,setPatientData] = useState({
      id: null, 
      firstName:"",
      lastName:"",
      middleInitial:"",
      birthday:"",
      age:"",
      phoneNum:"",
      email:"",
      });
    const navigate = useNavigate();
    //Retrieves Cached ID and Post them to editingItem
    useEffect(() => {
      if ('caches' in window) {
          caches.open("TRPatientData").then(cache => {
            cache.match("TRPatientData").then(response => {
              if (response) {
                response.text().then(patientData => {
                  const parsedData = JSON.parse(patientData)
                  console.log('Retrieved from cache:', parsedData);
                  setPatientData(parsedData);
                });
              } else {
                console.log('Nothing in cache');
              }
            });
          });
        }
  }, []);

  
    

    useEffect(() => {
        const itemsRef = ref(database, 'patients/');
        onValue(itemsRef, (snapshot) => {
          const data = snapshot.val();
          console.log(snapshot.val())
          const loadedItems = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    
          //retrive loaded items from local
          setData(loadedItems);
      });
      }, []);
   

    const {dispatch} = useContext(RecordContext);
  
  
    const handleCloseRecord = useCallback((e) => {
      e.preventDefault();
      navigate("/");
    }, [navigate, dispatch]);


    return(
        <>
            <p>Here's your record</p>
          
            
                <div ><p>{patientData.id}</p></div>
                <div >{patientData.firstName}</div>
                <div >{patientData.lastName}</div>
                <div >{patientData.middleInitial}</div>
                <div >{patientData.age}</div>
                <div >{patientData.birthday}</div>

            <button onClick={handleCloseRecord}>
                Close
            </button>
        </>
        
    )
}
import { useContext, useEffect, useState, useCallback } from "react";
import { RecordContext } from "../components/RecordContext";
import { useNavigate } from "react-router-dom";
import { database } from "../config/firebase-config";
import { onValue, ref } from "firebase/database";

export function TreatmentRecord(){

    const [data,setData] = useState([]);
    const {patientUID} = useContext(RecordContext);
    const navigate = useNavigate();
    console.log(patientUID);
  
    

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
      dispatch({ type: 'CLOSE_RECORD'});
      console.log('dispatch success');
      navigate("/");
    }, [navigate, dispatch]);


    return(
        <>
            <p>Here's your record</p>
          
            {data.filter((lists) =>
            lists.id.includes(patientUID)
            ).map((lists) => (
              <div key={lists.id}>
                <div >{lists.id}</div>
                <div >{lists.firstName}</div>
                <div >{lists.lastName}</div>
                <div >{lists.middleInitial}</div>
                <div >{lists.age}</div>
                <div >{lists.birthday}</div>
                </div>
            ))}

            <button onClick={handleCloseRecord}>
                Close
            </button>
        </>
        
    )
}
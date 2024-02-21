import { useContext, useEffect, useState, useCallback } from "react";
import { RecordContext } from "../components/RecordContext";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

export function TreatmentRecord(){

    const [data,setData] = useState([]);
    const {patientUID} = useContext(RecordContext);
    const navigate = useNavigate();
    console.log(patientUID);
   
    let list=[];
    //Run Once
    useEffect(() => {
        const DataFetch = async () =>{
            try {
                const querySnapshot = await getDocs(collection(db, "patients"));
                querySnapshot.forEach((doc) => {
                //input arr to list arr = firebaseDB doc
                list.push({id:doc.id, ...doc.data()});
                });
                //init "list" arr to setdata
                setData(list);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
         //run func
         DataFetch();
    }, []);



    const {dispatch} = useContext(RecordContext);
   
  
    const handleCloseRecord = useCallback((e,id) => {
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
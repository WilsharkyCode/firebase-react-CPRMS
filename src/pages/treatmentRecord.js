import { useContext, useEffect, useState } from "react";
import { RecordContext } from "../components/RecordContext";
import { Navigate } from "react-router-dom";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

export function TreatmentRecord(){

    const [data,setData] = useState([]);
    const {patientUID} = useContext(RecordContext);
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

        </>
        
    )
}
import { useContext } from "react";
import { RecordContext } from "../components/RecordContext";
import { Navigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

export function TreatmentRecord(){


    const {patientUID} = useContext(RecordContext);
    console.log(patientUID);
   
    return(
        <>
            <p>Here's your record</p>
            {patientUID}

        </>
        
    )
}
import { database } from "../config/firebase-config";
import { onValue, ref } from "firebase/database";
import { createContext, useEffect, useState,} from "react";

export const PatientDataReaderContext = createContext(null);


export const PatientDataReaderContextProvider = ({children}) => {
    const [data,setData] = useState([]);

    useEffect(() => {
        const itemsRef = ref(database, 'patients/');
        onValue(itemsRef, (snapshot) => {
          const data = snapshot.val();
          const loadedItems = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    
          //retrive loaded items from local
          setData(loadedItems);
        });
      }, []);


    return(
        <PatientDataReaderContext.Provider value={data}>
            {children}
        </PatientDataReaderContext.Provider>
    );
}
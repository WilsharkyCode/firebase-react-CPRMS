import { useContext, useEffect, useState, useCallback } from "react";
import { RecordContext } from "../../components/RecordContext";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { onValue, ref } from "firebase/database";
import TreatmentDTable from "./TreatmentDTable";

export function TreatmentRecord(){
  //Copy from DataTable the logic for this
  const [data,setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  //For Cached JSON patientData struc
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
  const {dispatch} = useContext(RecordContext);


    //Retrieves Cached JSON patientData struc, parses it and posts them to editingItem
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

  
    //TR Retriever
    useEffect(() => {
        const itemsRef = ref(database, 'TreatmentRecords/');
        onValue(itemsRef, (snapshot) => {
          const data = snapshot.val();
          console.log(snapshot.val())
          const loadedItems = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    
          //retrive loaded items from local
          setData(loadedItems);
      });
      }, []);
   
    const handleCloseRecord = useCallback((e) => {
      e.preventDefault();
      dispatch({type:"RETURN_ID"});
      navigate("/");
    }, [navigate, dispatch]);

    const handleAddTR = useCallback((e, id) => {
      e.preventDefault();
      dispatch({type:"ADD_RECORD", payload: id})
      console.log("UID: ",id ,"Dispatched")
      navigate("/addTreatmentRecord") 
      },
      [ navigate, dispatch],
    )
    
      //to Filter Keys
    const keys = ["date"];

    //handles search query on data from database
    const handleSearchQuery = (data) =>{
      return data?.filter((treatmentRecords) => 
        keys.some((key) => treatmentRecords[key].toLocaleLowerCase().includes(searchQuery))
      )
    };


    return(
        <>
          <div className='database-container' >
            <div className='top-nav'>
              <h5>Aldana Dental Clinic</h5>

              <form className='search-container'>
                <input type='text' 
                placeholder='Search Date' 
                className='basic-search-bar'
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/*<button className='search-btn' type="submit" disabled>Search</button>*/}
              </form>
            </div>

            <div className='display-container'>
              <div className='top-container'>
                <h3>Treatment Record:</h3>
                <button onClick={e => handleAddTR(e, patientData.id)} className='add-patient-btn'>
                    Add New Treatment Record
                </button>
                

                {/*Tailwindcss this*/}

              </div>
                <p>Here's your record</p>
                      <div ><p>{patientData.id}</p></div>
                      <div >{patientData.firstName}</div>
                      <div >{patientData.lastName}</div>
                      <div >{patientData.middleInitial}</div>
                      <div >{patientData.age}</div>
                      <div >{patientData.birthday}</div>
                {/*Sends data from firebase and setSearchQuery*/}
                <TreatmentDTable data={handleSearchQuery(data)} patientid={patientData.id}/>
          
              </div>
          </div>

                  <button onClick={handleCloseRecord}>
                      Close
                  </button>
        </>
        
    )
}
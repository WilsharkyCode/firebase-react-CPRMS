import LoginForm from "./pages/loginform";
import Database from "./pages/PatientDB/database";
import "./styles.css"
import { Routes ,Route, Navigate } from "react-router-dom";
import { AuthContext } from "./components/AuthContext";

import { useContext } from 'react';
import AddPatientRecordForm from "./pages/PatientDB/addPatientRecordForm";
import 'bootstrap/dist/css/bootstrap.css';
import { TreatmentRecord } from "./pages/TreatmentDB/treatmentRecord";
import EditPatientRecordForm from "./pages/PatientDB/editPatientRecord";
import AddTreatmentRecord from "./pages/TreatmentDB/addTreatmentrecord";


function App() {

  //imports global var currentUser
  const {currentUser} = useContext(AuthContext);

  //inputs children and shows children if CheckAuth is true
  //else login you go
  const AuthCheck = ({children}) =>{
    return currentUser ?  children : <Navigate to="/login"/>
  }

  var hours = 1; // to clear the localStorage after 1 hour
               // (if someone want to clear after 8hrs simply change hours=8)
  var now = new Date().getTime();
  var setupTime = localStorage.getItem('setupTime');
  if (setupTime == null) {
      localStorage.setItem('setupTime', now)
  } else {
      if(now-setupTime > hours*60*60*1000) {
          localStorage.clear()
          localStorage.setItem('setupTime', now);
      }
  }




  //React Routes and Protected Routes
  return (
    <div>
        <Routes>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/signup" />

            <Route exact path="/" element={
              <AuthCheck>
                <Database/>
              </AuthCheck>
              }/>
              <Route path="/recordform" element={
                <AuthCheck>
                  <AddPatientRecordForm/>
                </AuthCheck>
              }/>
              <Route path="/editrecordform" element={
                <AuthCheck>
                  <EditPatientRecordForm/>
                </AuthCheck>
              }/>
              <Route path="/treatment" element={
                <AuthCheck>
                  <TreatmentRecord/>
                </AuthCheck>
              }/>
              <Route path="/addtreatmentrecord" element={
                <AuthCheck>
                  <AddTreatmentRecord/>  
                </AuthCheck>
              }/>
        </Routes>
    </div>
  );
}

export default App;

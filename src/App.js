import LoginForm from "./pages/loginform";
import Database from "./pages/PatientDB/database";
import "./styles.css";
import { Routes, Route, Navigate } from "react-router-dom";

import { useContext } from "react";
import AddPatientRecordForm from "./pages/PatientDB/addPatientRecordForm";
import "bootstrap/dist/css/bootstrap.css";
import { TreatmentRecord } from "./pages/TreatmentDB/treatmentRecord";
import EditPatientRecordForm from "./pages/PatientDB/editPatientRecord";
import AddTreatmentRecord from "./pages/TreatmentDB/addTreatmentrecord";
import EditTreatmentRecord from "./pages/TreatmentDB/editTreatmentRecord";
import { useAuth } from "./components/authContext";

function App() {
  //imports global var currentUser
  const { currentUser } = useAuth();

  //inputs children and shows children if CheckAuth is true
  //else login you go
  const AuthCheck = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  //React Routes and Protected Routes
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" />

        <Route
          exact
          path="/"
          element={
            <AuthCheck>
              <Database />
            </AuthCheck>
          }
        />
        <Route
          path="/recordform"
          element={
            <AuthCheck>
              <AddPatientRecordForm />
            </AuthCheck>
          }
        />
        <Route
          path="/editrecordform"
          element={
            <AuthCheck>
              <EditPatientRecordForm />
            </AuthCheck>
          }
        />
        <Route
          path="/treatment"
          element={
            <AuthCheck>
              <TreatmentRecord />
            </AuthCheck>
          }
        />
        <Route
          path="/addtreatmentrecord"
          element={
            <AuthCheck>
              <AddTreatmentRecord />
            </AuthCheck>
          }
        />
        <Route
          path="/edittreatmentrecord"
          element={
            <AuthCheck>
              <EditTreatmentRecord />
            </AuthCheck>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

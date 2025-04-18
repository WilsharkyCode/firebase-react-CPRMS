import "./styles.css";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { useAuth } from "./components/authContext";

//Pages
import LoginForm from "./pages/loginform";
import Dashboard from "./pages/Dashboard";

import InventoryMain from "./pages/InventoryDB/InventoryMain";

import PatientPage from "./pages/PatientFiles/PatientPage";
import AddPatientForm from "./pages/PatientFiles/AddPatientForm";
import EditPatientForm from "./pages/PatientFiles/EditPatientForm";

import TreatmentRecordPage from "./pages/TreatmentFiles/TreatmentRecordPage";
import AddTreatmentRecord from "./pages/TreatmentFiles/addTreatmentrecord";
import EditTreatmentRecord from "./pages/TreatmentFiles/editTreatmentRecord";

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

        {/*Protected Routes Start*/}
        <Route
          exact
          path="/"
          element={
            <AuthCheck>
              <Dashboard />
            </AuthCheck>
          }
        />
        <Route
          exact
          path="/patient"
          element={
            <AuthCheck>
              <PatientPage />
            </AuthCheck>
          }
        />
        <Route
          path="/patient/add"
          element={
            <AuthCheck>
              <AddPatientForm />
            </AuthCheck>
          }
        />
        <Route
          path="/patient/edit"
          element={
            <AuthCheck>
              <EditPatientForm />
            </AuthCheck>
          }
        />
        <Route
          path="/patient/treatment"
          element={
            <AuthCheck>
              <TreatmentRecordPage />
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
        <Route
          path="/inventory"
          element={
            <AuthCheck>
              <InventoryMain />
            </AuthCheck>
          }
        />
        {/*Protected Routes End*/}
      </Routes>
    </div>
  );
}

export default App;

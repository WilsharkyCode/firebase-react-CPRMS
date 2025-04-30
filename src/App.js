import "./styles.css";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { useAuth } from "./components/authContext";

//Pages
import LoginForm from "./pages/loginform";
import Dashboard from "./pages/Dashboard";

import InventoryPage from "./pages/InventoryDB/InventoryPage";

import PatientPage from "./pages/PatientFiles/PatientPage";
import AddPatientForm from "./pages/PatientFiles/AddPatientForm";
import EditPatientForm from "./pages/PatientFiles/EditPatientForm";

import TreatmentRecordPage from "./pages/TreatmentFiles/TreatmentRecordPage";
import AddTreatmentRecord from "./pages/TreatmentFiles/addTreatmentrecord";
import EditTreatmentRecord from "./pages/TreatmentFiles/editTreatmentRecord";
import AddItemCategory from "./pages/InventoryDB/AddItemCategory";
import AddInventoryForm from "./pages/InventoryDB/AddInventoryForm";
import AddBranch from "./pages/AddBranch";
import DeleteCategoryForm from "./pages/InventoryDB/DeleteCategoryForm";
import EditInventoryForm from "./pages/InventoryDB/EditInventoryForm";
import AddInventoryTransactionsForm from "./pages/InventoryTransactionsDB/AddInventoryTransactions";
import InventoryTransactionsPage from "./pages/InventoryTransactionsDB/InventoryTransactionsPage";
import AddEmployeeForm from "./pages/EmployeeFiles/AddEmployeeForm";

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
          path="/patient/treatment/add"
          element={
            <AuthCheck>
              <AddTreatmentRecord />
            </AuthCheck>
          }
        />
        <Route
          path="/patient/treatment/edit"
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
              <InventoryPage />
            </AuthCheck>
          }
        />
        <Route
          path="/inventory/additemcategory"
          element={
            <AuthCheck>
              <AddItemCategory />
            </AuthCheck>
          }
        />
        <Route
          path="/inventory/deleteitemcategory"
          element={
            <AuthCheck>
              <DeleteCategoryForm />
            </AuthCheck>
          }
        />
        <Route
          path="/inventory/addinventory"
          element={
            <AuthCheck>
              <AddInventoryForm />
            </AuthCheck>
          }
        />
        <Route
          path="/inventory/editinventory"
          element={
            <AuthCheck>
              <EditInventoryForm />
            </AuthCheck>
          }
        />
        <Route
          path="/inventory/transactions/add"
          element={
            <AuthCheck>
              <AddInventoryTransactionsForm />
            </AuthCheck>
          }
        />
        <Route
          path="/inventory/transactions"
          element={
            <AuthCheck>
              <InventoryTransactionsPage />
            </AuthCheck>
          }
        />
        <Route path="/employees" element={<AuthCheck>{/*Empty*/}</AuthCheck>} />
        <Route
          path="/employees/add"
          element={
            <AuthCheck>
              <AddEmployeeForm />
            </AuthCheck>
          }
        />
        <Route
          path="/addbranch"
          element={
            <AuthCheck>
              <AddBranch />
            </AuthCheck>
          }
        />
        {/*Protected Routes End*/}
      </Routes>
    </div>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./components/AuthContext";
import { RecordContextProvider } from "./components/RecordContext";
import { StyledEngineProvider } from "@mui/material";
import "./index.css";

//removed react.strictmode cause it causes useEffect to fire twice

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StyledEngineProvider injectFirst>
    <RecordContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </RecordContextProvider>
  </StyledEngineProvider>
);

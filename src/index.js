import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/authContext";
import { StyledEngineProvider } from "@mui/material";
import "./index.css";
import { ConnectionContextProvider } from "./components/ConnectionContext";

//removed react.strictmode cause it causes useEffect to fire twice

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StyledEngineProvider injectFirst>
    <ConnectionContextProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ConnectionContextProvider>
  </StyledEngineProvider>
);

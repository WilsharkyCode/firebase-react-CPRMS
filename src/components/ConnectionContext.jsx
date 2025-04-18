import { createContext, useEffect, useReducer, useState } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { app } from "../config/firebase-config"; // Import your Firebase configuration
import LoadingScreen from "./LoadingScreen";

// Initial state only includes online status and Firebase connection status
const INITIAL_STATE = {
    isOnline: navigator.onLine,
    isFirebaseConnected: false,
  };
  
  // Reducer to handle changes to connection states
  const ConnectionReducer = (state, action) => {
    switch (action.type) {
      case "SET_ONLINE_STATUS":
        return { ...state, isOnline: action.payload };
      case "SET_FIREBASE_CONNECTION_STATUS":
        return { ...state, isFirebaseConnected: action.payload };
      default:
        return state;
    }
  };
  
  // Error page component to show when conditions are not met
  const ErrorPage = () => (
    <div className="flex items-center justify-center flex-col text-center h-dvh px-4">
      <h1 className="text-2xl font-bold mb-2">⚠️ Error: Firebase unreachable!</h1>
      <h2 className="text-lg">Please check your Firebase Console or Internet Connection then refresh your tab.</h2>
    </div>
  );
  
  // Loading screen component
  const LoadingPage = () => (
    <div>
      <LoadingScreen/>
    </div>
  );
  
  // Context provider that tracks network and Firebase connection status
  const ConnectionContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ConnectionReducer, INITIAL_STATE);
    const [loading, setLoading] = useState(true);
    const [errorTimeout, setErrorTimeout] = useState(false); // State to track if 5 seconds passed
    const database = getDatabase(app); // Initialize Firebase
  
    // Effect for tracking online/offline status
    useEffect(() => {
      const handleOnline = () => dispatch({ type: "SET_ONLINE_STATUS", payload: true });
      const handleOffline = () => {
        dispatch({ type: "SET_ONLINE_STATUS", payload: false });
        dispatch({ type: "SET_FIREBASE_CONNECTION_STATUS", payload: false }); // Reset Firebase connection status when offline
      };
  
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
  
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }, []);
  
    // Firebase connection listener
    useEffect(() => {
      if (!state.isOnline) {
        dispatch({ type: "SET_FIREBASE_CONNECTION_STATUS", payload: false });
        return;
      }
  
      const connectedRef = ref(database, ".info/connected");
  
      const unsubscribe = onValue(connectedRef, (snapshot) => {
        const isConnected = snapshot.val();
        dispatch({ type: "SET_FIREBASE_CONNECTION_STATUS", payload: isConnected });
      });
  
      return () => {
        off(connectedRef, "value", unsubscribe);
      };
    }, [state.isOnline, database]);
  
    // Effect to set the error page timeout after 5 seconds
    useEffect(() => {
      if (state.isOnline && state.isFirebaseConnected) {
        // If both are connected, stop loading and render children
        setLoading(false);
        return;
      }
  
      const timer = setTimeout(() => {
        setErrorTimeout(true); // Set error timeout to true after 5 seconds
      }, 5000);
  
      return () => clearTimeout(timer);
    }, [state.isOnline, state.isFirebaseConnected]);
  
    // Conditional rendering based on connection states and timeout
    if (loading) {
      return <LoadingPage />; // Show loading screen while checking connection
    }
  
    if (errorTimeout || !state.isOnline || !state.isFirebaseConnected) {
      return <ErrorPage />; // Show error page if 5 seconds passed with no connection
    }
  
    return (
      <ConnectionContext.Provider value={{ state, dispatch }}>
        {children} {/* Show children if everything is connected */}
      </ConnectionContext.Provider>
    );
  };
  
  // Create context for use in the app
  const ConnectionContext = createContext(INITIAL_STATE);
  
  export { ConnectionContext, ConnectionContextProvider };
import { useEffect, useState, createContext, useContext } from "react";
import { auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({children}) {
    const [currentUser, setcurrentUser] = useState(null);
    const [loading, setloading] = useState(true);

    //connects and disconnects Firebase auth when Auth change
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser)
        return unsubscribe;
    }, []);

    //if there is a user, set user as currentUser
    // else user = null
    // in between states, load
    async function initializeUser(user) {
        if (user) {
            setcurrentUser(...user)
        }
        else {
            setcurrentUser(null)
        }
        setloading(false);
    }

    const value = {
        currentUser,
        loading
    }

    return(
        <AuthContext.Provider value = {value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
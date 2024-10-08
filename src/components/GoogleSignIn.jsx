import { Button } from "react-bootstrap";
import { auth, provider } from "../config/firebase-config";
import { useNavigate } from "react-router-dom";
import {  signInWithPopup, go } from "firebase/auth";


//disabled until further notice
export default function GoogleSignIn(){
    const navigate = useNavigate();

    function handleOAuth() {
        provider.addScope('email');
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // The signed-in user info.
            const user = result.user;
            navigate("/") ;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            console.error("Sign-in error:", error);
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });

    }

    return(
        <>
        <Button onClick={() => handleOAuth()}>
                Sign in With Google
        </Button>
        </>
    )
    
};
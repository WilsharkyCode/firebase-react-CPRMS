import { useState, useContext } from "react";
import React from 'react'
import { auth } from "../config/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";


export default function LoginForm() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const {dispatch} = useContext(AuthContext);
  const navigate = useNavigate();

  //handles login for email and password
  const handleLogin = (e) => {
    //prevents page from autorefreashing and erasing entered data
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        dispatch({type:"LOGIN", payload: user})
        console.log(user)
        navigate("/") 
        // ...
      })
      .catch((error) => {
        setError(true)
      });
  }

  function errorMessage(){
    if(error){
      return <p className="incorrect-input">Incorrect username or password</p>
    }
  }

  return (
    <div className="align-center-container">
        <div className="login-container">
          <h2>Login Form</h2>
          {errorMessage()}
          <form className="login-form" onSubmit={handleLogin}>
                  <label for="username">Username:</label>
                  <input className="auth-input" type="text" onChange={e=>setEmail(e.target.value)} required></input>
                  <label for="password">Password:</label>
                  <input className="auth-input" type="password" onChange={e=>setPassword(e.target.value)} required></input>
                  <button className="login-btn" type="submit">Login</button>
          </form>
        </div>
    </div>
  )
}

import { useState } from "react";
import React from "react";
import { auth } from "../config/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/");
      })
      .catch((error) => {
        setError(true);
      });
  };

  function errorMessage() {
    if (error) {
      return <p className="incorrect-input">Incorrect username or password</p>;
    }
  }

  return (
    <>
      <div className="align-center-container ">
        <form className="form lg:w-[37.5%] w-[100%]" onSubmit={handleLogin}>
          <label
            className="mb-10 text-center
          "
          >
            ALDANA DENTAL CLINIC MANAGEMENT SYSTEM
          </label>
          <p>Login</p>
          {errorMessage()}
          <div className="group">
            <input
              required
              className="main-input"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="highlight-span" />
            <label className="lebal-email">Email</label>
          </div>
          <div className="container-1">
            <div className="group relative">
              <input
                required
                className="main-input pr-10" // Added padding for the toggle button
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="highlight-span" />
              <label className="lebal-email">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button className="login-btn mt-10" type="submit">
            Login
          </button>
        </form>
      </div>
    </>
  );
}

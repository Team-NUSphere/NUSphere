import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  type User,
  type Unsubscribe,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { authenticateWithBackend } from "../contexts/authContext";

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // const authenticateWithBackend = async () => {
  //   let idToken = null;
  //   try {
  //     const user = auth.currentUser;
  //     if (!user) {
  //       console.warn("No user logged in, cannot make authentication call");
  //       return;
  //     }
  //     idToken = await user.getIdToken();
  //     console.log("Firebase auth successful");
  //   } catch (firebaseAuthError) {
  //     console.error("Firebase auth unsuccessful");
  //   }
  //   try {
  //     const response = await fetch("http://localhost:3001/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${idToken}`,
  //       },
  //     });
  //     if (response.ok) {
  //       console.log("Backend authenticated");
  //     } else {
  //       console.error("Backend authentication failed");
  //     }
  //   } catch (networkError) {
  //     console.error("Network failure");
  //   }
  // };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("connecting with backend");
      await authenticateWithBackend("register");
      navigate(from, { replace: true });
    } catch (err) {
      const errorMsg: string =
        err instanceof Error ? err.message : "Signup failed";
      setError(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

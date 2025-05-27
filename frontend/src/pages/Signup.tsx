import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  type User,
  type Unsubscribe,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const errorMsg: string =
        err instanceof Error ? err.message : "Signup failed";
      setError(errorMsg);
    }
  };
  useEffect(() => {
    const unsubscribe: Unsubscribe = auth.onAuthStateChanged(
      (user: User | null) => {
        if (user) {
          navigate("/");
        }
      }
    );
    return () => unsubscribe();
  }, [navigate]);

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

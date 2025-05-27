import "./App.css";
import React, { useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SignOutButton from "./components/SignOutButton";

function App() {
  return (
    <Router>
      <div className="App">
        <SignOutButton />
        <Routes>
          <Route path="/" element={<h1>Welcome to NuSphere</h1>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

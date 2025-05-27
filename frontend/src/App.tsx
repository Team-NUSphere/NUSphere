import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import SignOutButton from "./components/SignOutButton.tsx";

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

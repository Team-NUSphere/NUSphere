import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../output.css";

const SignOutButton: React.FC = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/auth", { replace: true });
    } catch (err) {
      const errorMsg: string =
        err instanceof Error ? err.message : "Signout failed";
      alert(errorMsg);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="sign-out-button px-6 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium"
    >
      Sign Out button broken, pls refresh page after clicking
    </button>
  );
};

export default SignOutButton;

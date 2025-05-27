import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignOutButton: React.FC = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      const errorMsg: string =
        err instanceof Error ? err.message : "Signout failed";
      alert(errorMsg);
    }
  };

  return (
    <button onClick={handleSignOut} className="sign-out-button">
      Sign Out
    </button>
  );
};

export default SignOutButton;

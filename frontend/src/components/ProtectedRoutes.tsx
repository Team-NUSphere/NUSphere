import type React from "react";
import { getAuth } from "../contexts/authContext";
import { useLocation, Navigate } from "react-router-dom";

const ProtectedRoutes: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated, isLoadingAuth } = getAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <h2>Loading profile</h2>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoutes;

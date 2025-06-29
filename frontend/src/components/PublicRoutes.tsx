import type React from "react";
import { getAuth } from "../contexts/authContext";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoutes: React.FC = () => {
  const { isAuthenticated, isLoadingAuth } = getAuth();

  if (isLoadingAuth) {
    return <h2>Loading profile</h2>;
  }

  if (isAuthenticated) {
    return <Navigate to="/timetable" replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;

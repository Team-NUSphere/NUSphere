import { createBrowserRouter, Navigate } from "react-router-dom";
//import Signup from "./pages/Signup";
//import Login from "./pages/Login";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import PublicRoutes from "./components/PublicRoutes";
import ProtectedRoute from "./components/ProtectedRoutes";
import Layout from "./components/Layout";
import Modules from "./pages/Modules";
import UserTimetable from "./pages/UserTimetable";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
      },
    ],
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/timetable",
        element: <UserTimetable />,
      },
      {
        path: "/modules/:moduleCode",
        element: <Modules />,
      },
      {
        path: "/modules",
        element: <Navigate to="/modules/ABM5003" replace />,
      },
      {
        path: "/forum",
        element: <div> Hello, forum </div>,
      },
      {
        path: "/settings",
        element: <div> Hello, settings </div>,
      },
    ],
  },
]);

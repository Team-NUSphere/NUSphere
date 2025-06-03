import { createBrowserRouter } from "react-router-dom";
//import Signup from "./pages/Signup";
//import Login from "./pages/Login";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import PublicRoutes from "./components/PublicRoutes";
import ProtectedRoute from "./components/ProtectedRoutes";

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
]);

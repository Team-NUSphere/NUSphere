import { createBrowserRouter } from "react-router-dom";
//import Signup from "./pages/Signup";
//import Login from "./pages/Login";
import AuthPage from "./pages/AuthPage"; 
//import HomePage from "./pages/Home";
import PublicRoutes from "./components/PublicRoutes";
import ProtectedRoute from "./components/ProtectedRoutes";
import SignOutButton from "./components/SignOutButton";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Welcome to NUSphere</h1>
          <SignOutButton />
        </div>
        {/* <HomePage /> */}
      </ProtectedRoute>
    ),
  },
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "auth",
        element: <AuthPage />,
      }
    ],
  },
]);

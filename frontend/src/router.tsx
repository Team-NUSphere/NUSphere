import { createBrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Welcome to NUSphere</div>,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
  },
]);

import { createBrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PublicRoutes from "./components/PublicRoutes";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Welcome to NUSphere</div>,
  },
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

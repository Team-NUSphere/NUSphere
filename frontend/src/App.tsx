import "./App.css";
import { RouterProvider } from "react-router-dom";
import SignOutButton from "./components/SignOutButton";
import { router } from "./router";
import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

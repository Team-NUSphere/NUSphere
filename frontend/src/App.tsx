import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./contexts/authContext";
import { TimetableProvider } from "./contexts/timetableContext";

function App() {
  return (
    <AuthProvider>
      <TimetableProvider>
        <RouterProvider router={router} />
      </TimetableProvider>
    </AuthProvider>
  );
}

export default App;

import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./contexts/authContext";
import { TimetableProvider } from "./contexts/timetableContext";
import { WebSocketProvider } from "./contexts/webSocketContext";

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <TimetableProvider>
          <RouterProvider router={router} />
        </TimetableProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;

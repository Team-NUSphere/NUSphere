import { Outlet } from "react-router-dom";
import { Navbar } from "../pages/Navbar";
import Sidebar from "../pages/Sidebar";
// import "../output.css";

export default function Layout() {
  return (
    <div className="flex flex-column overflow-hidden h-screen">
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  );
}

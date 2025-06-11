import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Sidebar from "./Sidebar";
// import "../output.css";

export default function Layout() {
  return (
    <div className="flex flex-column">
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  );
}

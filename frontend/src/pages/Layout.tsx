import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  );
}

import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { FiBookOpen } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import NavItem from "./NavItem";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (err) {
      const errorMsg: string =
        err instanceof Error ? err.message : "Signout failed";
      alert(errorMsg);
    }
  };

  return (
    // <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 top-0 z-50 h-screen flex">
    //   <div className="container mx-auto px-4">
    //     <div className="flex flex-row flex-nowrap justify-between items-center">
    //       {/* Logo */}
    //       <div className="flex flex-row items-center space-x-2">
    //         <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
    //           <span className="text-white font-bold text-lg">N</span>
    //         </div>
    //         {/* <span className="text-xl font-bold text-gray-800">NUSphere</span> */}
    //       </div>
    //       {/* Desktop Navigation */}
    //       <div className="hidden md:flex flex-row items-center space-x-8 bg-black">
    //         <a
    //           href="#"
    //           className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
    //         >
    //           Dashboard
    //         </a>
    //         <a
    //           href="#"
    //           className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
    //         >
    //           Courses
    //         </a>
    //         <a
    //           href="#"
    //           className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
    //         >
    //           Community
    //         </a>
    //         <a
    //           href="#"
    //           className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
    //         >
    //           Resources
    //         </a>
    //       </div>
    //       s{/* User Menu */}
    //       <div className="md:flex items-center space-x-4">
    //         {/* Notifications */}
    //         <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors relative">
    //           <svg
    //             className="w-5 h-5"
    //             fill="none"
    //             stroke="currentColor"
    //             viewBox="0 0 24 24"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M15 17h5l-5 5v-5zM10.5 3.5a6 6 0 0 1 6 6v2l1.5 3h-15l1.5-3v-2a6 6 0 0 1 6-6z"
    //             />
    //           </svg>
    //           <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
    //         </button>

    //         {/* Profile */}
    //         <div className="flex items-center space-x-3">
    //           <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
    //             <svg
    //               className="w-5 h-5 text-gray-600"
    //               fill="none"
    //               stroke="currentColor"
    //               viewBox="0 0 24 24"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth={2}
    //                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    //               />
    //             </svg>
    //           </div>
    //           <span className="text-sm font-medium text-gray-700">
    //             John Doe
    //           </span>
    //         </div>

    //         {/* Sign Out Button */}
    //         <button
    //           onClick={handleSignOut}
    //           className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
    //         >
    //           <svg
    //             className="w-4 h-4"
    //             fill="none"
    //             stroke="currentColor"
    //             viewBox="0 0 24 24"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    //             />
    //           </svg>
    //           <span>Sign Out</span>
    //         </button>
    //       </div>
    //       {/* Mobile Menu Button */}
    //       <button
    //         className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
    //         onClick={() => setIsMenuOpen(!isMenuOpen)}
    //       >
    //         <svg
    //           className="w-6 h-6"
    //           fill="none"
    //           stroke="currentColor"
    //           viewBox="0 0 24 24"
    //         >
    //           {isMenuOpen ? (
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M6 18L18 6M6 6l12 12"
    //             />
    //           ) : (
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M4 6h16M4 12h16M4 18h16"
    //             />
    //           )}
    //         </svg>
    //       </button>
    //     </div>

    //     {/* Mobile Menu */}
    //     {isMenuOpen && (
    //       <div className="md:hidden py-4 border-t border-gray-200">
    //         <div className="flex flex-col space-y-4">
    //           <a
    //             href="#"
    //             className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
    //           >
    //             Dashboard
    //           </a>
    //           <a
    //             href="#"
    //             className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
    //           >
    //             Courses
    //           </a>
    //           <a
    //             href="#"
    //             className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
    //           >
    //             Community
    //           </a>
    //           <a
    //             href="#"
    //             className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
    //           >
    //             Resources
    //           </a>

    //           <div className="pt-4 border-t border-gray-200">
    //             <div className="flex items-center space-x-3 mb-4">
    //               <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
    //                 <svg
    //                   className="w-5 h-5 text-gray-600"
    //                   fill="none"
    //                   stroke="currentColor"
    //                   viewBox="0 0 24 24"
    //                 >
    //                   <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     strokeWidth={2}
    //                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    //                   />
    //                 </svg>
    //               </div>
    //               <span className="text-sm font-medium text-gray-700">
    //                 John Doe
    //               </span>
    //             </div>

    //             <button
    //               onClick={handleSignOut}
    //               className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
    //             >
    //               <svg
    //                 className="w-4 h-4"
    //                 fill="none"
    //                 stroke="currentColor"
    //                 viewBox="0 0 24 24"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   strokeWidth={2}
    //                   d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    //                 />
    //               </svg>
    //               <span>Sign Out</span>
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </nav>
    <nav className="bg-white/90 backdrop-blur-sm h-screen w-20">
      <div className=" h-full flex flex-col justify-between items-center">
        <div className="flex flex-col justify-start items-center space-y-5 w-full p-2 h-auto">
          <NavItem to="/test" icon={FiCalendar} label="Timetable"></NavItem>
          <NavItem to="/mod" icon={FiBookOpen} label="Courses"></NavItem>
          <NavItem to="/forum" icon={FiMessageSquare} label="Forum"></NavItem>

          {/* <NavLink className="flex flex-col items-center aspect-square w-full">
            <FiCalendar className="h-full text-3xl" />
            <span className="text-sm">Timetable</span>
          </NavLink>
          <NavLink className="flex flex-col items-center aspect-square w-full">
            <FiBookOpen className="h-full text-3xl" />
            <span className="text-sm">Courses</span>
          </NavLink>
          <NavLink className="flex flex-col items-center aspect-square w-full">
            <FiMessageSquare className="h-full text-3xl" />
            <span className="text-sm">Forum</span>
          </NavLink> */}
        </div>

        <div className="flex flex-col justify-start items-center space-y-5 w-full p-2">
          <NavItem to="/settings" icon={FiSettings} label="Settings"></NavItem>
          <NavItem to="/logout" icon={FiLogOut} label="Logout"></NavItem>
          {/* <NavLink className="flex flex-col items-center justify-self-end aspect-square w-full">
            <FiSettings className="h-full text-3xl" />
            <span className="text-sm">Settings</span>
          </NavLink>
          <NavLink className="flex flex-col items-center justify-self-end aspect-square w-full">
            <FiLogOut className="h-full text-3xl" />
            <span className="text-sm">Logout</span>
          </NavLink> */}
        </div>
      </div>
    </nav>
  );
}

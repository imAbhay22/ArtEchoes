import React, { useState, useRef, useEffect, useContext } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { DarkContext } from "../Mode/DarkContext";
import { use } from "react";

const ProfileDropdown = () => {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { darkMode } = useContext(DarkContext);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center focus:outline-none"
      >
        <CgProfile className="text-2xl" />
      </button>
      {open && (
        <div
          className={`absolute right-0 z-50 w-48 py-2 mt-4 rounded-md shadow-lg  ${
            darkMode ? "bg-[#1e1e1e] text-[#f4f4f4]" : "bg-white text-gray-800"
          }`}
        >
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="block px-4 py-2 ">
                My Profile
              </Link>
              <Link to="/downloads" className="block px-4 py-2 ">
                My Downloads
              </Link>
              <Link to="/settings" className="block px-4 py-2 ">
                Settings
              </Link>
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-left "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-2 ">
                Login
              </Link>
              <Link to="/signup" className="block px-4 py-2 ">
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

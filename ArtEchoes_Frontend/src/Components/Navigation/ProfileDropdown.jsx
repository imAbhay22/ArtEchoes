import React, { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ProfileDropdown = () => {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        <div className="absolute right-0 mt-4 w-48 text-black bg-white rounded-md shadow-lg py-2 z-50">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                My Profile
              </Link>
              <Link
                to="/downloads"
                className="block px-4 py-2 hover:bg-gray-200"
              >
                My Downloads
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-200"
              >
                Settings
              </Link>
              <button
                onClick={logout}
                className="w-full text-left block px-4 py-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">
                Login
              </Link>
              <Link to="/signup" className="block px-4 py-2 hover:bg-gray-200">
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

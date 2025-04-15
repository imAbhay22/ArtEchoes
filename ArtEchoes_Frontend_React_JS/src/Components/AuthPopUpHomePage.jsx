import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import img from "../assets/Images/AboutImg.jpg";

const AuthPopUpHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopUp, setShowPopup] = useState(true);

  // Do not show the modal on specific pages.
  if (
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/signup"
  ) {
    return null;
  }

  if (!showPopUp) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center text-black z-500 backdrop-blur-sm">
      <div
        className=" w-[90vw] md:w-[50vw] h-[50vh] rounded-lg p-[2vh] text-center flex flex-col justify-center bg-cover bg-center relative shadow-2xl"
        style={{ backgroundImage: `url(${img})` }}
      >
        {/* Light overlay to brighten the background image */}
        <div className="absolute inset-0 rounded-lg bg-white/60"></div>

        <button
          onClick={() => setShowPopup(false)}
          className="absolute flex items-center justify-center w-10 h-10 text-black transition top-2 right-2 hover:text-red-600"
        >
          ✕
        </button>
        {/* Content positioned on top of the overlay */}
        <div className="relative">
          <h2
            className="text-[calc(2vw+1rem)] font-extrabold mb-[2vh]"
            style={{ fontFamily: "'Lobster', cursive" }}
          >
            Hey, <span className="text-red-500">Join</span>{" "}
            <span className="text-blue-500">Art</span>
            <span className="text-green-500">Echoes!</span>
          </h2>
          <p
            className="mb-[2vh] text-[calc(1vw+0.8rem)] font-semibold"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Unlock <span className="text-purple-500">amazing</span> features by
            logging in or signing up.
          </p>
          <div>
            <button
              onClick={() => navigate("/login")}
              className="px-[calc(1vw+0.8rem)] py-[calc(0.5vh+0.5rem)] bg-gray-600 text-white rounded-sm hover:bg-blue-700 mr-[1vw] shadow-md font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-[calc(1vw+0.8rem)] py-[calc(0.5vh+0.5rem)] bg-gray-600 text-white rounded-sm hover:bg-green-600 ml-[1vw] shadow-md font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPopUpHomePage;

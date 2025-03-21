import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import img from "../assets/Images/AboutImg.jpg";

const AuthPopUpHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Do not show the modal on specific pages.
  if (
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/signup"
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className=" sm:w-[40vw]  md:w-[40vw] h-[50vh] rounded-lg p-[2vh] text-center flex flex-col justify-center bg-cover bg-center relative shadow-2xl"
        style={{ backgroundImage: `url(${img})` }}
      >
        {/* Light overlay to brighten the background image */}
        <div className="absolute inset-0 bg-white/60 rounded-lg"></div>
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

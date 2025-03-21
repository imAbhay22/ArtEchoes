import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkContext } from "../Mode/DarkContext";

const Logo = () => {
  const { darkMode } = useContext(DarkContext);
  const logoSrc = darkMode ? "/white_logo.svg" : "/Black_logo.svg";

  return (
    <div className="flex items-center">
      <Link to="/" className="text-3xl md:text-4xl lg:text-5xl font-bold">
        <img src={logoSrc} alt="Logo" className="h-12 cursor-pointer" />
      </Link>
    </div>
  );
};

export default Logo;

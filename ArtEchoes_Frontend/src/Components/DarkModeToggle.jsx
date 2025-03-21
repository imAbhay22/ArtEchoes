import React, { useContext } from "react";
import { DarkContext } from "./Mode/DarkContext";

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkContext);

  return (
    <div className="flex items-center justify-center">
      <label
        htmlFor="darkModeToggle"
        className="flex items-center cursor-pointer"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="darkModeToggle"
            className="sr-only"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <div
            className={`block w-14 h-8 rounded-full transition ${
              darkMode ? "bg-gray-800" : "bg-gray-400"
            }`}
          ></div>
          <div
            className={`dot absolute top-1 bg-white w-6 h-6 rounded-full transition-all 
              ${darkMode ? "translate-x-6" : "translate-x-1"}`}
          ></div>
        </div>
        <div className="ml-3 font-medium text-sm text-gray-800 dark:text-gray-500">
          {darkMode ? "Dark Mode" : "Light Mode"}
        </div>
      </label>
    </div>
  );
};

export default DarkModeToggle;

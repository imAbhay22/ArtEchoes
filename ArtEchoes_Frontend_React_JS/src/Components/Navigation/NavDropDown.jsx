import { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkContext } from "../Mode/DarkContext"; // adjust path if needed

const NavDropdown = ({ title, options, defaultTo }) => {
  const { darkMode } = useContext(DarkContext);

  // Use the same background colors as in app.css, either via CSS variables or hardcoded here:
  const dropdownBg = darkMode
    ? "var(--bg-color-dark)"
    : "var(--bg-color-light)";

  return (
    <div className="relative group">
      {defaultTo ? (
        <Link
          to={defaultTo}
          // Inherit text color from parent; additional classes can be added as needed
          style={{ color: "inherit" }}
          className="text-2xl font-bold hover:underline focus:outline-none"
        >
          {title}
        </Link>
      ) : (
        <span
          style={{ color: "inherit" }}
          className="text-2xl font-bold focus:outline-none"
        >
          {title}
        </span>
      )}
      <div
        style={{ backgroundColor: dropdownBg }}
        className="absolute left-0 invisible w-48 py-2 mt-2 transition-all duration-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible"
      >
        {options.map(({ label, to }, idx) => (
          <Link
            key={idx}
            to={to}
            style={{ color: "inherit" }}
            className="block px-4 py-2 hover:bg-gray-300"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavDropdown;

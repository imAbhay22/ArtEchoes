import { Link } from "react-router-dom";

const NavDropdown = ({ title, options, defaultTo }) => {
  return (
    <div className="relative group">
      {/* Wrap the title in a Link if defaultTo is provided */}
      {defaultTo ? (
        <Link
          to={defaultTo}
          className="text-2xl font-bold text-gray-800 hover:text-gray-900 focus:outline-none"
        >
          {title}
        </Link>
      ) : (
        <span className="text-2xl font-bold text-gray-800 hover:text-gray-900 focus:outline-none">
          {title}
        </span>
      )}
      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        {options.map(({ label, to }, idx) => (
          <Link
            key={idx}
            to={to}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavDropdown;

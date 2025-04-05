import { Link } from "react-router-dom";
import { useAppContext } from "./AppContext";
import { useContext, useEffect, useRef } from "react";
import { DarkContext } from "./Mode/DarkContext";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const sidebarRef = useRef(null);

  const { darkMode } = useContext(DarkContext);
  const modeClass = darkMode ? "dark-mode" : "light-mode";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSidebarOpen]);

  const categories = [
    { name: "Oil Painting", path: "/oil-painting" },
    { name: "Watercolor", path: "/watercolor" },
    { name: "Acrylic Painting", path: "/acrylic-painting" },
    { name: "Sketch", path: "/sketch" },
    { name: "Digital Art", path: "/digital-art" },
    { name: "Sculpture", path: "/sculpture" },
    { name: "Photography", path: "/photography" },
    { name: "Mixed Media", path: "/mixed-media" },
    { name: "Collage", path: "/collage" },
    { name: "Abstract Art", path: "/abstract-art" },
    { name: "Impressionism", path: "/impressionism" },
    { name: "Pop Art", path: "/pop-art" },
    { name: "Minimalism", path: "/minimalism" },
    { name: "Conceptual Art", path: "/conceptual-art" },
    { name: "Printmaking", path: "/printmaking" },
    { name: "Portrait Painting", path: "/portrait-painting" },
    { name: "Landscape Painting", path: "/landscape-painting" },
    { name: "Modern Art", path: "/modern-art" },
    { name: "Street Art", path: "/street-art" },
    { name: "Realism", path: "/realism" },
    { name: "Surrealism", path: "/surrealism" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full z-200 transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Apply dark/light mode class here */}
      <div
        ref={sidebarRef}
        className={`relative w-64 h-full shadow-xl ${modeClass}`}
      >
        <div
          className={`absolute right-0 px-4 py-3 text-sm font-medium transition-colors origin-left rotate-90 translate-x-full -translate-y-1/2 shadow-md cursor-pointer top-1/2 ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-purple-600"
              : "bg-yellow-100 text-gray-700 hover:bg-purple-300"
          }`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "CLOSE" : "MENU"}
        </div>

        <div className="h-full p-6 overflow-y-auto">
          <h2
            className={`mb-3 text-xl font-bold mt-28 xl:mt-18 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Categories
          </h2>
          <ul className="space-y-4">
            {categories.map((item) => (
              <li
                key={item.name}
                className={`transition-colors cursor-pointer ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

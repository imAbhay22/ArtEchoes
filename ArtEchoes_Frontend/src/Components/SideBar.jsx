import { Link } from "react-router-dom";
import { useAppContext } from "./AppContext";
import { useEffect, useRef } from "react";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the sidebar, close it
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSidebarOpen]);

  // Updated categories with all art paths
  const categories = [
    { name: "Oil Painting", path: "/oil-painting" },
    { name: "Watercolor", path: "/watercolor" },
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
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full z-40 transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div ref={sidebarRef} className="bg-white h-full w-64 shadow-xl relative">
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full bg-yellow-100 px-4 py-3 
                    shadow-md cursor-pointer rotate-90 origin-left hover:bg-purple-300 transition-colors
                    text-sm font-medium text-gray-700"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "CLOSE" : "MENU"}
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mt-26 mb-3">Categories</h2>
          <ul className="space-y-4">
            {categories.map((item) => (
              <li
                key={item.name}
                className="text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
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

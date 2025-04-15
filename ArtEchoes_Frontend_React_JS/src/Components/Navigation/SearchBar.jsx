import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DarkContext } from "../Mode/DarkContext";
const SearchBar = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { darkMode } = useContext(DarkContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get("/api/artworks");
        const lower = searchTerm.toLowerCase();
        const filtered = response.data.artworks.filter((art) =>
          art.title?.toLowerCase().includes(lower)
        );
        // Show top 5 suggestions
        setSuggestions(filtered.slice(0, 5));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const handleSelectSuggestion = (title) => {
    setSearchTerm(title);
    navigate(`/search?q=${encodeURIComponent(title)}`);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* For large screens (lg and up) */}
      <input
        type="text"
        placeholder="Search entire collection..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={`hidden sm:block pl-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 w-full ${className}`}
      />

      {/* For small and medium screens */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={`block sm:hidden max-w-md pl-8 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 w-full ${className}`}
      />
      <svg
        className="absolute w-5 h-5 pointer-events-none left-3 top-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className={`absolute z-10  w-full mt-1 border rounded shadow-lg ${
            darkMode ? "bg-[#1e1e1e] text-[#f4f4f4]" : "bg-white text-gray-800"
          }`}
        >
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="px-4 py-2 cursor-pointer hover:bg-purple-100 hover:text-gray-800"
              onMouseDown={() => handleSelectSuggestion(item.title)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;

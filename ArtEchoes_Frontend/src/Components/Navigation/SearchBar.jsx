const SearchBar = ({ setSearchQuery, className }) => (
  <div className="relative">
    {/* Mobile Input */}
    <input
      type="text"
      placeholder="Search"
      onChange={(e) => setSearchQuery(e.target.value)}
      className={`block lg:hidden pl-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
    />
    {/* Desktop Input */}
    <input
      type="text"
      placeholder="Search entire collection..."
      onChange={(e) => setSearchQuery(e.target.value)}
      className={`hidden lg:block pl-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
    />
    <svg
      className="w-5 h-5 absolute left-3 top-3 text-gray-400 pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
);

export default SearchBar;

import { useState, useContext } from "react";
import { DarkContext } from "./Mode/DarkContext";
import image1 from "../assets/Images/AboutImg.jpg";
import ArtDetailModal3D from "./ArtworkDetailModal3D";

const ArtGrid3D = ({ artworks = [], emptyItems = 0, loading, error }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { darkMode } = useContext(DarkContext);

  const defaultArtworks = [
    { id: 1, title: "3D Sculpture", artist: "John Doe", image: image1 },
    { id: 2, title: "Abstract Form", artist: "Jane Smith", image: image1 },
    { id: 3, title: "Digital Model", artist: "Alex Brown", image: image1 },
    { id: 4, title: "Character Model", artist: "Sarah Lee", image: image1 },
  ];

  const isDataAvailable = artworks.length > 0;
  const itemsToDisplay = isDataAvailable ? artworks : defaultArtworks;

  const filteredArtworks = itemsToDisplay.filter(
    (art) =>
      art &&
      (art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.artist?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const itemsWithPlaceholders = [
    ...filteredArtworks,
    ...Array(Math.max(0, emptyItems - filteredArtworks.length)).fill(null),
  ];

  const getThumbnailPath = (artwork) => {
    if (!artwork) return image1;
    if (artwork.image) return artwork.image;
    if (artwork.thumbnail)
      return encodeURI(`http://localhost:5000/${artwork.thumbnail}`);
    return encodeURI(
      `http://localhost:5000/uploads/3d-art/thumbnails/default-thumbnail.jpg`
    );
  };

  const handleArtworkClick = (artwork) => {
    if (!artwork) return;
    setSelectedArtwork(artwork);
    // You'll implement ArtDetailModal3D later
  };

  return (
    <div
      className={`pl-8 mt-20 lg:mt-10 pr-8 min-h-[50vh] pb-8 w-full transition-colors duration-500 ${
        isDataAvailable &&
        (darkMode ? "bg-[#1e1e1e] text-[#f4f4f4]" : "bg-white text-gray-800")
      }`}
    >
      {/* Error message */}
      {error && (
        <div className="mb-6 text-center text-red-500">
          Error loading 3D artworks: {error.message}
        </div>
      )}

      {/* Search bar */}
      {isDataAvailable && (
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search 3D artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`p-2 rounded-md shadow-md w-[70%] font-semibold focus:outline-none transition-all duration-300
              ${
                darkMode
                  ? "bg-[#2b2b2b] text-white placeholder:text-gray-400 border border-[#444]"
                  : "bg-[#f9f9f9] text-gray-800 border border-gray-300"
              }`}
          />
        </div>
      )}

      {/* Artworks Grid */}
      <div className="flex flex-wrap justify-around">
        {itemsWithPlaceholders.map((artwork, index) => (
          <div
            key={artwork?.id || index}
            className={`rounded-xl overflow-hidden transition-transform duration-300 transform hover:scale-[1.03] hover:shadow-lg w-full md:w-[47%] lg:w-[30%] xl:w-[22%] aspect-[5/4] m-3 cursor-pointer ${
              darkMode ? "bg-[#2a2a2a]" : "bg-white"
            }`}
            onClick={() => handleArtworkClick(artwork)}
          >
            {artwork ? (
              <div className="relative w-full h-full overflow-hidden group">
                <img
                  loading="lazy"
                  src={getThumbnailPath(artwork)}
                  alt={artwork.title}
                  className="object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-105"
                />
                {/* 3D Badge */}
                <div className="absolute px-2 py-1 text-xs text-white bg-blue-600 rounded-full top-2 right-2 opacity-80">
                  3D
                </div>
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <h3 className="font-semibold truncate text-md">
                    {artwork.title}
                  </h3>
                  <p className="text-xs">{artwork.artist}</p>
                  {artwork.price && (
                    <p className="mt-1 text-xs font-medium">₹{artwork.price}</p>
                  )}
                </div>
              </div>
            ) : (
              // Skeleton Placeholder
              <div className="h-full animate-pulse">
                <div
                  className={`w-full h-full ${
                    darkMode ? "bg-[#3a3a3a]" : "bg-gray-200"
                  }`}
                />
                <div className="p-4 space-y-2">
                  <div
                    className={`w-3/4 h-4 rounded ${
                      darkMode ? "bg-[#4a4a4a]" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`w-1/2 h-4 rounded ${
                      darkMode ? "bg-[#4a4a4a]" : "bg-gray-200"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && artworks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-16 h-16 mb-4 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p
            className={`text-xl font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No 3D artworks found
          </p>
          <p
            className={`mt-2 text-center ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Be the first to upload amazing 3D art
          </p>
        </div>
      )}

      {selectedArtwork && (
        <ArtDetailModal3D
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
};

export default ArtGrid3D;

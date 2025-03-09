import { useState } from "react";
import ArtDetailModal from "./ArtDetailModal";
import { useAppContext } from "./AppContext";
import image1 from "../assets/Images/AboutImg.jpg";

const ArtGrid = ({ artworks = [], emptyItems = 0 }) => {
  const { loading, error } = useAppContext();
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Local search state

  // Handle loading and error states
  if (loading) return <div className="text-center">Loading artworks...</div>;
  if (error)
    return <div className="text-center">Error loading artworks: {error}</div>;

  // Sample static artworks data
  const defaultArtworks = [
    { id: 1, title: "Sunset Glow", artist: "John Doe", image: image1 },
    { id: 2, title: "Mountain View", artist: "Jane Smith", image: image1 },
    { id: 3, title: "City Lights", artist: "Alex Brown", image: image1 },
    { id: 4, title: "Ocean Breeze", artist: "Sarah Lee", image: image1 },
  ];

  // Use provided artworks if available, else use default static artworks
  const itemsToDisplay = artworks.length > 0 ? artworks : defaultArtworks;

  // Filter artworks based on search query
  const filteredArtworks = itemsToDisplay.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create empty items array if needed
  const itemsWithPlaceholders = [
    ...filteredArtworks,
    ...Array(Math.max(0, emptyItems - filteredArtworks.length)).fill(null),
  ];

  return (
    <div className="pl-8 mt-10 pr-8 pb-8 w-full">
      {/* Search Input */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search artworks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border bg-white rounded-lg shadow-md w-[70%] focus:outline-none"
        />
      </div>

      {/* Artworks Grid */}
      <div className="flex justify-around flex-wrap">
        {itemsWithPlaceholders.map((artwork, index) => (
          <div
            key={artwork?.id || index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-[60.66vw] h-[26.66vh] lg:w-[16.66vw] lg:h-[16.66vh] m-2"
          >
            {artwork ? (
              <div
                onClick={() => setSelectedArtwork(artwork)}
                className="cursor-pointer h-full"
              >
                <img
                  src={
                    artwork.filePath
                      ? encodeURI(
                          `http://localhost:5000/${artwork.filePath.replace(
                            /\\/g,
                            "/"
                          )}`
                        )
                      : image1
                  }
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />

                <div className="p-2">
                  <h3 className="text-lg font-semibold mb-2">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-600">{artwork.artist}</p>
                </div>
              </div>
            ) : (
              // Skeleton loading state
              <div className="animate-pulse h-full">
                <div className="bg-gray-200 w-full h-full" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conditionally render the modal if an artwork is selected */}
      {selectedArtwork && (
        <ArtDetailModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
};

export default ArtGrid;

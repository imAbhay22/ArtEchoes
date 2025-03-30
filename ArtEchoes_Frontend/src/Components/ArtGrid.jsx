import { useState } from "react";
import ArtDetailModal from "./ArtDetailModal";
import { useAppContext } from "./AppContext";
import image1 from "../assets/Images/AboutImg.jpg";

const ArtGrid = ({ artworks = [], emptyItems = 0 }) => {
  const { loading, error } = useAppContext();
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Local search state

  if (loading) return <div className="text-center">Loading artworks...</div>;
  if (error)
    return <div className="text-center">Error loading artworks: {error}</div>;

  const defaultArtworks = [
    { id: 1, title: "Sunset Glow", artist: "John Doe", image: image1 },
    { id: 2, title: "Mountain View", artist: "Jane Smith", image: image1 },
    { id: 3, title: "City Lights", artist: "Alex Brown", image: image1 },
    { id: 4, title: "Ocean Breeze", artist: "Sarah Lee", image: image1 },
  ];

  const itemsToDisplay = artworks.length > 0 ? artworks : defaultArtworks;

  const filteredArtworks = itemsToDisplay.filter(
    (artwork) =>
      artwork &&
      (artwork.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.artist?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const itemsWithPlaceholders = [
    ...filteredArtworks,
    ...Array(Math.max(0, emptyItems - filteredArtworks.length)).fill(null),
  ];

  return (
    <div className="pl-8 mt-10 pr-8 min-h-[50vh] pb-8 w-full">
      {/* Search Input */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search artworks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 bg-transparent focus:bg-blend-darken border-l-2 border-b-4 border-t-0 border-r-0 border-gray-800 rounded-lg shadow-md w-[70%] focus:outline-none font-bold text-gray-800"
        />
      </div>

      {/* Artworks Grid */}
      <div className="flex flex-wrap justify-around">
        {itemsWithPlaceholders.map((artwork, index) => (
          <div
            key={artwork?.id || index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-[60.66vw] h-[26.66vh] lg:w-[16.66vw] lg:h-[16.66vh] m-2"
          >
            {artwork ? (
              <div
                onClick={() => {
                  if (!artwork.filePath) return;
                  setSelectedArtwork(artwork);
                }}
                className="relative h-full cursor-pointer"
              >
                <img
                  loading="lazy"
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
                  className="object-cover w-full h-full"
                />

                {/* Title & Artist Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-black/70">
                  <h3 className="font-semibold text-md">{artwork.title}</h3>
                  <p className="text-xs">{artwork.artist}</p>
                </div>
              </div>
            ) : (
              // Skeleton loading state
              <div className="h-full animate-pulse">
                <div className="w-full h-full bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Art Detail Modal */}
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

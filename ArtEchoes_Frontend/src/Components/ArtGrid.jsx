import { useState } from "react";
import ArtDetailModal from "./ArtDetailModal";
import { useAppContext } from "./AppContext";
import image1 from "../assets/Images/AboutImg.jpg";

const ArtGrid = ({ artworks = [], emptyItems = 0, defaultArtworks }) => {
  const { loading, error } = useAppContext();
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <div className="text-center">Loading artworks...</div>;
  if (error)
    return <div className="text-center">Error loading artworks: {error}</div>;

  const internalDefaultArtworks = defaultArtworks || [
    { id: 1, title: "Sunset Glow", artist: "John Doe", image: image1 },
    { id: 2, title: "Mountain View", artist: "Jane Smith", image: image1 },
    { id: 3, title: "City Lights", artist: "Alex Brown", image: image1 },
    { id: 4, title: "Ocean Breeze", artist: "Sarah Lee", image: image1 },
  ];

  const itemsToDisplay =
    artworks.length > 0 ? artworks : internalDefaultArtworks;

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
            className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-[1.03] hover:shadow-lg w-full md:w-[47%] lg:w-[30%] xl:w-[22%] aspect-[5/4] m-3 cursor-pointer"
            onClick={() => {
              if (!artwork?.filePath && !artwork?.image) return;
              setSelectedArtwork(artwork);
            }}
          >
            {artwork ? (
              <div className="relative w-full h-full overflow-hidden group">
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
                      : artwork.image || image1
                  }
                  alt={artwork.title}
                  className="object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-105"
                />

                {/* Overlay Title */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-semibold truncate text-md">
                    {artwork.title}
                  </h3>
                  <p className="text-xs">{artwork.artist}</p>
                </div>
              </div>
            ) : (
              // Skeleton
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

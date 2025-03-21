import { useState, useEffect } from "react";
import ArtDetailModal from "./ArtDetailModal";
import image1 from "../assets/Images/AboutImg.jpg";

const ArtGridAll = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all artworks from the API on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/artworks") // Update this URL to your actual endpoint
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch artworks");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // Debugging
        setArtworks(Array.isArray(data.artworks) ? data.artworks : []); // Ensure it's an array
        setLoading(false);
      })

      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle loading and error states
  if (loading) return <div className="text-center">Loading artworks...</div>;
  if (error)
    return <div className="text-center">Error loading artworks: {error}</div>;

  // Filter artworks based on the search query (by title or artist)
  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredArtworks.map((artwork, index) => (
          <div
            key={artwork.id || index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-[60.66vw] h-[26.66vh] lg:w-[16.66vw] lg:h-[16.66vh] m-2"
          >
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
                <h3 className="text-lg font-semibold mb-2">{artwork.title}</h3>
                <p className="text-gray-600">{artwork.artist}</p>
              </div>
            </div>
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

export default ArtGridAll;

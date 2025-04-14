import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import ArtGrid from "./ArtGrid";

const ArtworksSearchPage = () => {
  // State variables for artwork data, loading, errors, and the search query.
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch artwork data when the component mounts.
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/artworks")
      .then((response) => {
        // Store the artworks if valid; otherwise, fall back to an empty array.
        setArtworks(
          Array.isArray(response.data.artworks) ? response.data.artworks : []
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter artworks based on the search query.
  // It checks if the artwork's title or artist includes the search query (case-insensitive).
  const filteredArtworks = artworks.filter((artwork) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      artwork.title?.toLowerCase().includes(lowerQuery) ||
      artwork.artist?.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <header className="py-6 text-center text-white bg-purple-600">
        <h1 className="text-3xl font-bold">Artworks Collection</h1>
      </header>

      {/* Main Content Area */}
      <main className="p-8">
        {/* The SearchBar is used to update the search query. */}
        <SearchBar setSearchQuery={setSearchQuery} className="mb-6" />

        {/* Show loading or error messages if needed */}
        {loading && <div className="text-center">Loading artworks...</div>}
        {error && (
          <div className="text-center text-red-600">Error: {error}</div>
        )}

        {/* Once loaded, render the ArtGrid with filtered artworks. */}
        {!loading && !error && (
          <ArtGrid artworks={filteredArtworks} emptyItems={0} />
        )}
      </main>
    </div>
  );
};

export default ArtworksSearchPage;

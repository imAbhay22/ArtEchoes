import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ArtGrid from "../Components/ArtGrid";
import axios from "axios";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/artworks");
        setArtworks(response.data.artworks || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  useEffect(() => {
    if (!query || artworks.length === 0) {
      setFilteredArtworks(artworks);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = artworks.filter(
      (artwork) =>
        artwork.title?.toLowerCase().includes(lowerCaseQuery) ||
        artwork.artist?.toLowerCase().includes(lowerCaseQuery) ||
        artwork.description?.toLowerCase().includes(lowerCaseQuery) ||
        artwork.tags?.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
    );

    setFilteredArtworks(filtered);
  }, [query, artworks]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Search Results</h1>
        <div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );

  const hasResults = filteredArtworks.length > 0;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-2 text-2xl font-bold">Search Results</h1>

      {query && (
        <p className="mb-6 text-gray-600">
          {hasResults
            ? `Showing ${filteredArtworks.length} result${
                filteredArtworks.length !== 1 ? "s" : ""
              } for "${query}"`
            : `No matching artworks found for "${query}"`}
        </p>
      )}

      {hasResults ? (
        <ArtGrid artworks={filteredArtworks} />
      ) : (
        <div className="space-y-8">
          <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
            <p className="text-sm text-yellow-700">
              No artworks matched your search. Try different keywords or browse
              our full collection below.
            </p>
          </div>

          <h2 className="mt-8 mb-4 text-xl font-semibold">All Artworks</h2>
          <ArtGrid artworks={artworks} />
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/"
          className="font-medium text-purple-600 hover:text-purple-800"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SearchResults;

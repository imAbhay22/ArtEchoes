import { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import ArtGrid from "../ArtGrid";

const ArtCategoryPage = ({ category, title }) => {
  const { artworks, loading, error } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Reset pagination when the category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // When artworks are loading, safely handle the artworks array
  const artworksArray = loading ? [] : Array.isArray(artworks) ? artworks : [];

  // Filter artworks based on the category field stored in MongoDB
  const filteredArtworks = artworksArray.filter((art) =>
    art.categories?.some((c) => c.toLowerCase() === category.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredArtworks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArtworks = filteredArtworks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-6 text-center text-[silver]">
        {title || "All Artworks"}
      </h2>

      {error && (
        <div className="text-red-500 text-center py-8">
          Error loading artworks: {error.message}
        </div>
      )}

      <ArtGrid
        artworks={currentArtworks}
        loading={loading}
        error={error}
        gridClass="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        emptyItems={loading ? itemsPerPage : 0}
      />

      {totalPages > 1 && (
        <div className="w-[75vw] mx-auto flex justify-center mt-8">
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-gray-800 transition-colors text-lg"
          >
            {loading ? "Loading..." : `Load More ${title}`}
          </button>
        </div>
      )}

      {!loading && filteredArtworks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No artworks found in this category
        </div>
      )}
    </div>
  );
};

export default ArtCategoryPage;

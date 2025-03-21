import { useState, useEffect, useRef } from "react";
import ArtDetailModal from "./ArtDetailModal";
import image1 from "../assets/Images/AboutImg.jpg";

const InfiniteArtScroll = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const containerRef = useRef(null);
  const requestRef = useRef();

  // Fetch artworks
  useEffect(() => {
    fetch("http://localhost:5000/api/artworks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch artworks");
        return res.json();
      })
      .then((data) => {
        setArtworks(Array.isArray(data.artworks) ? data.artworks : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;

    requestRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      const scrollCenter = container.scrollLeft + container.clientWidth / 2;

      Array.from(container.children[0].children).forEach((item) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(scrollCenter - itemCenter);
        const maxDistance = container.clientWidth * 0.4; // 40% threshold
        const scale = Math.max(0.8, 1.2 - (distance / maxDistance) * 0.4);

        item.style.transform = `scale(${scale})`;
        item.style.zIndex = Math.floor(scale * 100);
        item.style.margin = `0 1vw`; // Add horizontal margin
      });
    });
  };

  if (loading) return <div className="text-center">Loading artworks...</div>;
  if (error) return <div className="text-center">Error: {error}</div>;

  return (
    <div className="relative h-[45vh] w-full overflow-hidden">
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-full overflow-x-scroll hide-scrollbar"
        onScroll={handleScroll}
      >
        <div className="h-full inline-flex items-center px-[15vw]">
          {/* Reduced padding */}
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id || index}
              className="w-[35vw] h-[35vh] transition-transform duration-300 relative" // Smaller base size
            >
              <div
                onClick={() => setSelectedArtwork(artwork)}
                className="cursor-pointer h-full w-full"
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
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white">
                  <h3 className="text-md font-semibold">{artwork.title}</h3>
                  <p className="text-xs">{artwork.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Art detail modal */}
      {selectedArtwork && (
        <ArtDetailModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
};

export default InfiniteArtScroll;

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
      const items = Array.from(container.children[0].children);

      let closestIndex = 0;
      let minDistance = Infinity;

      // Find the closest item to the center
      items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(scrollCenter - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      // Update each item's appearance
      items.forEach((item, index) => {
        item.classList.remove("center-artwork");
        let scale = 1;
        let zIndex = 10;

        if (index === closestIndex) {
          scale = 1.2; // Center artwork
          zIndex = 30;
          item.classList.add("center-artwork");
        } else if (index === closestIndex - 1 || index === closestIndex + 1) {
          scale = 1.1; // Immediate side artworks
          zIndex = 20;
        }

        item.style.transform = `scale(${scale})`;
        item.style.zIndex = zIndex;
      });
    });
  };

  useEffect(() => {
    if (artworks.length > 0) handleScroll();
  }, [artworks]);

  if (loading) return <div className="text-center">Loading artworks...</div>;
  if (error) return <div className="text-center">Error: {error}</div>;

  return (
    <div className="relative h-[55vh] w-full overflow-hidden">
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-full overflow-x-scroll hide-scrollbar"
        onScroll={handleScroll}
      >
        {/* Removed horizontal padding and increased gap between items */}
        <div className="inline-flex items-center h-full gap-x-12">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id || index}
              className="art-card flex-shrink-0 w-[35vw] lg:w-[18vw] h-[40vh] relative transition-transform duration-300 ease-in-out cursor-pointer group rounded-xl shadow-md overflow-hidden bg-white"
              onClick={() => setSelectedArtwork(artwork)}
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
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-black/70">
                <h3 className="font-semibold text-md">{artwork.title}</h3>
                <p className="text-xs">{artwork.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
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

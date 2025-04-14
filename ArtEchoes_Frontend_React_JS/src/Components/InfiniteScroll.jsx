import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ArtDetailModal from "./ArtDetailModal";
import image1 from "../assets/Images/AboutImg.jpg";

const InfiniteArtScroll = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  // Fetches artwork data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/artworks")
      .then((response) => {
        // Update state with artwork data if valid, otherwise set empty array
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

  // Determines which artwork is centered in the view as user scrolls
  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    // scrollCenter is Their sum divided by 2 gives the center position along the x-axis
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    const items = Array.from(container.querySelectorAll(".art-card"));

    // Find which artwork is closest to the center of the viewport
    let closestIndex = 0;
    let minDistance = Infinity;

    items.forEach((item, index) => {
      // calculate center by adding offsetLeft and half of the item's width
      // offsetLeft gives the distance from the left edge of the container to the left edge of the item
      // item.offsetWidth / 2 gives half the width of the item
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(scrollCenter - itemCenter); // calculates the absolute distance from the center by subtracting the two centers
      // make the closestIndex the index with the smallest distance by comparing it to the current minDistance
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex(closestIndex);
  };
  // This effect runs whenever the number of artworks changes (i.e., when artwork data is fetched).
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // whenever we scroll, we call the handleScroll function to update the activeIndex
      container.addEventListener("scroll", handleScroll);
      // setting a timeout to call handleScroll after 100ms to ensure that the activeIndex is updated correctly
      // This is useful for smoother scrolling experience, especially when the user scrolls quickly.
      setTimeout(handleScroll, 100);
      // cleanup function to remove the event listener when the component unmounts or when artworks change
      // This prevents memory leaks and ensures that the event listener is not called multiple times.
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [artworks.length]);

  // Shows loading or error state if needed
  if (loading) return <div className="text-center">Loading artworks...</div>;
  if (error) return <div className="text-center">Error: {error}</div>;

  return (
    <div className="relative h-[55vh] w-full overflow-hidden">
      <div
        ref={containerRef}
        className="h-full overflow-x-scroll hide-scrollbar"
      >
        <div className="inline-flex items-center h-full px-6 gap-x-12">
          {artworks.map((artwork, index) => {
            // Determine visual state of each artwork card based on position
            const isActive = index === activeIndex;
            const isAdjacent =
              index === activeIndex - 1 || index === activeIndex + 1;

            return (
              <motion.div
                key={artwork.id || index}
                className={`art-card flex-shrink-0 w-[35vw] lg:w-[18vw] h-[40vh] relative cursor-pointer group rounded-xl shadow-md overflow-hidden bg-white ${
                  isActive ? "center-artwork" : ""
                }`}
                onClick={() => setSelectedArtwork(artwork)}
                animate={{
                  // Animation properties to emphasize active and adjacent artworks
                  scale: isActive ? 1.3 : isAdjacent ? 1.1 : 1,
                  zIndex: isActive ? 30 : isAdjacent ? 20 : 10,
                  transition: {
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1], // custom bezier curve for smooth animation
                  },
                }}
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
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal for displaying detailed artwork information when clicked */}
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

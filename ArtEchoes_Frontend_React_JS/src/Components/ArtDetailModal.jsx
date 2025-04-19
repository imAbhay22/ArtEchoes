import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/Images/AboutImg.jpg";
import { DarkContext } from "./Mode/DarkContext";
import { FiX, FiMaximize, FiHeart, FiShare2 } from "react-icons/fi";

const ArtDetailModal = ({ artwork, onClose }) => {
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);
  const { darkMode } = useContext(DarkContext);
  const modeClass = darkMode ? "dark-mode" : "light-mode";

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Reset loading state when artwork changes
  useEffect(() => {
    setIsLoading(true);
  }, [artwork]);

  // Handle app visibility changes to fix loading issue
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        imgRef.current &&
        imgRef.current.complete
      ) {
        setIsLoading(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Check cached image on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      handleImageLoad({ target: imgRef.current });
    }
  }, []);

  if (!artwork) return null;

  // Calculate aspect ratio
  function getAspectRatio(width, height) {
    if (!width || !height) return "0:0";
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  }
  const aspectRatio = getAspectRatio(imgSize.width, imgSize.height);

  // Get image source
  const getImageSrc = () => {
    if (artwork.filePath) {
      return encodeURI(
        `http://localhost:5000/${artwork.filePath.replace(/\\/g, "/")}`
      );
    } else if (artwork.image) {
      return artwork.image;
    } else {
      return image1;
    }
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImgSize({ width: naturalWidth, height: naturalHeight });
    setIsLoading(false);
  };

  const getCategoryBadge = () => (
    <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full sm:px-3">
      {artwork.categories || "Painting"}
    </span>
  );

  // Full-screen mode
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/95 z-[999]">
        <button
          onClick={() => setIsFullScreen(false)}
          className="absolute z-[999] top-2 right-2 sm:top-8 sm:right-14 p-1 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
        >
          <FiX className="w-5 h-5 text-white sm:w-6 sm:h-6" />
        </button>
        <div className="w-full h-full p-4 overflow-auto sm:p-8">
          <img
            ref={imgRef}
            loading="lazy"
            src={getImageSrc()}
            alt={artwork.title}
            className="object-contain mx-auto cursor-pointer"
            onClick={() => setIsFullScreen(false)}
            onLoad={handleImageLoad}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed mt-40 xl:mt-25 inset-0 flex items-center justify-center p-2 sm:p-4 z-[250] bg-black/80 backdrop-blur-md">
      <div className="bg-white w-[95vw] sm:w-[90vw] max-h-[98vh] sm:max-h-[90vh] flex flex-col md:flex-row relative shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute z-[999] top-2 right-2 sm:top-4 sm:right-4 p-1 sm:p-2 bg-white/70 hover:bg-white rounded-full shadow transition"
        >
          <FiX className="w-4 h-4 text-gray-700 sm:w-5 sm:h-5" />
        </button>

        {/* Image Section */}
        <div className="relative flex items-center justify-center w-full h-40 bg-gray-100 sm:h-64 md:h-auto md:flex-1 md:w-3/5">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-8 h-8 border-2 border-gray-400 rounded-full sm:w-12 sm:h-12 border-t-gray-800 animate-spin"></div>
            </div>
          )}
          <div className="absolute z-10 top-2 left-2 sm:top-6 sm:left-6">
            {getCategoryBadge()}
          </div>
          <div className="relative flex items-center justify-center w-full h-full p-4 overflow-hidden sm:p-8">
            <img
              ref={imgRef}
              loading="lazy"
              src={getImageSrc()}
              alt={artwork.title}
              className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={handleImageLoad}
            />
            <button
              onClick={() => setIsFullScreen(true)}
              className="absolute flex items-center gap-1 p-1 text-xs text-gray-600 transition rounded-md shadow bottom-2 right-2 sm:bottom-6 sm:right-6 sm:p-2 sm:text-sm bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <FiMaximize className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">View</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`${modeClass} md:w-2/5 w-full flex flex-col p-4 sm:p-6 md:p-8 overflow-y-auto`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-grow space-y-2 sm:space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-light truncate sm:text-2xl md:text-3xl">
                  {artwork.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div>
                  <div className="text-sm font-medium sm:text-base">
                    {artwork.artist || "Unknown Artist"}
                  </div>
                  <div className="text-xs sm:text-sm">
                    {artwork.createdAt
                      ? new Date(artwork.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </div>
                </div>
              </div>
              <div className="mt-1 overflow-y-auto prose sm:mt-2 prose-xs sm:prose-sm max-h-20 sm:max-h-32 md:max-h-none">
                {artwork.description ||
                  "A beautiful piece of art which currently lacks a proper description."}
              </div>
              <div className="pt-2 border-t border-gray-200 sm:pt-3 md:pt-4">
                <h3 className="mb-2 text-base font-medium sm:mb-3 sm:text-lg">
                  Artwork Details
                </h3>
                <div className="grid grid-cols-2 text-xs gap-x-2 sm:gap-x-6 gap-y-2 sm:gap-y-3 sm:text-sm">
                  <div>
                    <span className="text-gray-500">Dimensions</span>
                    <p>
                      {imgSize.width} × {imgSize.height} px
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Aspect Ratio</span>
                    <p>{aspectRatio}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Medium</span>
                    <p>Digital only</p>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 sm:pt-3 md:pt-4">
                <h3 className="mb-1 text-base font-medium sm:mb-2 sm:text-lg">
                  Provenance
                </h3>
                <p className="text-xs sm:text-sm">
                  {artwork.provenance ||
                    "Currently most of the artworks are either taken from internet or made by me."}
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="pt-3 mt-auto sm:pt-4 md:pt-6">
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex items-end justify-between mb-1 sm:mb-2">
                  <div>
                    <span className="text-xs text-gray-500 sm:text-sm">
                      Price
                    </span>
                    <p className="text-lg font-medium sm:text-xl md:text-2xl">
                      {artwork.price > 0 ? `₹${artwork.price}` : "Free"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 transition rounded-full sm:p-2 hover:bg-gray-100">
                      <FiHeart className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5 hover:text-gray-600" />
                    </button>
                    <button className="p-1 transition rounded-full sm:p-2 hover:bg-gray-100">
                      <FiShare2 className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5 hover:text-gray-600" />
                    </button>
                  </div>
                </div>
                <button className="w-full py-2 text-sm font-medium text-white transition bg-black rounded sm:py-3 sm:text-base hover:bg-gray-800">
                  Purchase Artwork
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtDetailModal;

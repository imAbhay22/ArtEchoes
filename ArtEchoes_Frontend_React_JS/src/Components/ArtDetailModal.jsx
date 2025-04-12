import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/Images/AboutImg.jpg";
import { DarkContext } from "./Mode/DarkContext";

const ArtDetailModal = ({ artwork, onClose }) => {
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const { darkMode } = useContext(DarkContext);
  const modeClass = darkMode ? "dark-mode" : "light-mode";
  if (!artwork) return null;

  // Function to calculate aspect ratio of the image
  // copied from online cause I was too lazy to write it myself 😅
  function getAspectRatio(width, height) {
    if (width === 0 || height === 0) return "0:0"; // Handle zero dimensions
    function gcd(a, b) {
      return b === 0 ? a : gcd(b, a % b);
    }
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  }
  const aspectRatio = getAspectRatio(imgSize.width, imgSize.height);

  // to get the image source from the file path or the image URL
  // if the image is not found, it will use a default image
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

  // Full-screen preview mode
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-999">
        <img
          loading="lazy"
          src={getImageSrc()}
          alt={artwork.title}
          className="object-contain w-full h-full cursor-pointer"
          onClick={() => setIsFullScreen(false)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 mt-15 z-250 bg-black/50">
      <div className="bg-white rounded-xl w-[75vw] h-[75vh] flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-4xl text-white transition-colors -top-8 -left-8 hover:text-gray-300"
        >
          ×
        </button>

        {/* Preview Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsFullScreen(true)}
            className="px-4 py-2 text-white transition-colors rounded-full bg-black/60 hover:bg-black/80"
          >
            Preview
          </button>
        </div>

        {/* Image Section */}
        <div className="h-[70%] w-full overflow-hidden">
          <img
            loading="lazy"
            src={getImageSrc()}
            alt={artwork.title}
            className="object-contain w-full h-full bg-gray-400"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.target;
              setImgSize({ width: naturalWidth, height: naturalHeight });
            }}
          />
        </div>

        {/* Content Section */}
        <div
          className={`flex ${modeClass} flex-col justify-between flex-1 p-6`}
        >
          <div>
            <h2 className="mb-2 text-3xl font-bold">{artwork.title}</h2>
            <p>
              {artwork.description ||
                "A beautiful piece of art which currently lacks a proper description."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4 mt-10 ">
            <div className="flex gap-4">
              <button className="px-6 py-2 text-white transition-colors bg-black rounded-lg hover:bg-gray-800">
                Buy Now
              </button>
              <button className="px-6 py-2 text-white transition-colors bg-black rounded-lg hover:bg-gray-800">
                Share
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm ">
              <p>
                Size: {imgSize.width} x {imgSize.height} pixels
              </p>
              <p>Aspect Ratio: {aspectRatio}</p>
              <p>{artwork.price > 0 ? `$${artwork.price}` : "Free"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtDetailModal;

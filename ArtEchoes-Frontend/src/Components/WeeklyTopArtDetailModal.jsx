import { useState } from "react";

const ArtDetailModal = ({ artwork, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!artwork) return null;

  // Full-screen preview mode
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => setIsFullScreen(false)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-[75vw] h-[75vh] flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-8 -left-8 text-white text-4xl hover:text-gray-300 transition-colors"
        >
          ×
        </button>

        {/* Preview Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsFullScreen(true)}
            className="bg-black/60 text-white px-4 py-2 rounded-full hover:bg-black/80 transition-colors"
          >
            Preview
          </button>
        </div>

        {/* Image Section */}
        <div className="h-[70%] w-full overflow-hidden">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{artwork.title}</h2>
            <p className="text-gray-600">
              {artwork.description ||
                "A beautiful piece of art which currently lacks a proper description."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex mt-10 gap-4">
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Buy Now
            </button>
            <button className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtDetailModal;

import { useState } from "react";

const ArtDetailModal = ({ artwork, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!artwork) return null;

  // Full-screen preview mode
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-400">
        <img
          loading="lazy"
          src={artwork.image}
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
            src={artwork.image}
            alt={artwork.title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between flex-1 p-6">
          <div>
            <h2 className="mb-2 text-3xl font-bold">{artwork.title}</h2>
            <p className="text-gray-600">
              {artwork.description ||
                "A beautiful piece of art which currently lacks a proper description."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-10">
            <button className="px-6 py-2 text-white transition-colors bg-black rounded-lg hover:bg-gray-800">
              Buy Now
            </button>
            <button className="px-6 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtDetailModal;

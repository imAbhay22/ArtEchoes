import { useState } from "react";
import WeeklyTopArtDetailModal from "./WeeklyTopArtDetailModal";
import weeklyImage1 from "../assets/Images/weekly1.jpg";

const WeeklyTopArt = () => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Static Weekly Top Art Data
  const weeklyTopArtworks = [
    {
      id: 1,
      title: "Masterpiece One",
      artist: "Emily Rose",
      image: weeklyImage1,
    },
    {
      id: 2,
      title: "Masterpiece Two",
      artist: "James Carter",
      image: weeklyImage1,
    },
    {
      id: 3,
      title: "Masterpiece Three",
      artist: "Sophia White",
      image: weeklyImage1,
    },
    {
      id: 4,
      title: "Abstract Vision",
      artist: "Olivia Harper",
      image: weeklyImage1,
    },
  ];

  return (
    <div className="w-full pb-8 pl-4 pr-4">
      <div className="flex flex-wrap justify-around">
        {weeklyTopArtworks.map((artwork) => (
          <div
            key={artwork.id}
            onClick={() => setSelectedArtwork(artwork)}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg w-full md:w-[60.66vw]  h-[26.66vh] lg:w-[16.66vw] lg:h-[16.66vh] m-2 cursor-pointer"
          >
            {artwork.image ? (
              <img
                loading="lazy"
                src={artwork.image}
                alt={artwork.title}
                className="object-cover w-full h-full overflow-hidden transition duration-300 transform hover:scale-150"
              />
            ) : (
              <div className="h-full bg-gray-200 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {selectedArtwork && (
        <WeeklyTopArtDetailModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
};

export default WeeklyTopArt;

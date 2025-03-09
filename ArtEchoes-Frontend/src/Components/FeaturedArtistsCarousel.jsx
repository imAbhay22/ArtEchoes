import React from "react";
import { motion } from "framer-motion";
import img1 from "../assets/FeaturedArtist/bakugo.jpg";
import img2 from "../assets/FeaturedArtist/pakf.jpg";
import img3 from "../assets/FeaturedArtist/peakpx.jpg";

const artists = [
  {
    id: 1,
    name: "Vincent Van Gogh",
    style: "Post-Impressionism",
    image: img1,
  },
  {
    id: 2,
    name: "Frida Kahlo",
    style: "Surrealism",
    image: img2,
  },
  {
    id: 3,
    name: "Pablo Picasso",
    style: "Cubism",
    image: img3,
  },
];

const FeaturedArtistsCarousel = () => {
  return (
    <div className="w-full py-[5vh]">
      <h2 className="text-[calc(1.5vw+1rem)] font-bold text-center mb-[3vh]">
        Featured Artists of the Month
      </h2>
      <div className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide px-[2vw] md:px-[4vw] gap-[2vw] pb-[4vh] flex justify-center">
        {artists.map((artist) => (
          <motion.div
            key={artist.id}
            className="snap-center min-w-[30vw] lg:min-w-[25vw] flex-shrink-0 relative group "
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="max-w-[25vw] mx-auto aspect-square bg-gray-200 rounded-2xl overflow-hidden relative">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />

              <div className="absolute bottom-0 left-0 right-0 p-[2vw] bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-[calc(1vw+1rem)] font-bold text-white">
                  {artist.name}
                </h3>
                <p className="text-[calc(0.8vw+0.5rem)] text-gray-200">
                  {artist.style}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedArtistsCarousel;

import { useEffect } from "react";
import { useAppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { currentHeroIndex, setCurrentHeroIndex, heroImages } = useAppContext();

  const navigate = useNavigate();

  const handleClick = () => {
    // List of available paths
    const pages = ["/paintings", "/traditional-art", "/digital-art"];
    // Pick a random page
    const randomPage = pages[Math.floor(Math.random() * pages.length)];
    navigate(randomPage);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [heroImages.length, setCurrentHeroIndex]);

  return (
    <div className="relative h-[50vh]">
      <div className="absolute inset-0 z-0">
        {heroImages.length > 0 ? (
          <div className="relative w-full h-full">
            {heroImages.map((img, index) => (
              <img
                loading="lazy"
                key={img}
                src={img}
                alt="Gallery Background"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentHeroIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-500" />
        )}
      </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative px-4 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">
            Behold Our Top Masterpieces
          </h1>
          <p className="mb-8 text-xl">
            There is a lot more where that came from, hehe..
          </p>
          <button
            onClick={handleClick}
            className="px-8 py-3 font-semibold text-gray-800 transition-all bg-white rounded-full hover:bg-opacity-90"
          >
            View Collection
          </button>
        </div>
      </div>

      {/* Fog vanishing effect */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[15%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent)",
        }}
      ></div>
    </div>
  );
};

export default HeroSection;

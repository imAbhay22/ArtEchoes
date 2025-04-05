import React, { useState, useEffect } from "react";
import { useAppContext } from "./AppContext";
const HeroSection = () => {
  const { currentHeroIndex, setCurrentHeroIndex, heroImages } = useAppContext();

  // State for controlling overlay opacity and upward movement
  const [overlayStyle, setOverlayStyle] = useState({
    opacity: 1,
    translateY: 0,
  });

  // Cycle through hero images every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [heroImages.length, setCurrentHeroIndex]);

  // Fade out and move the overlay upward on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeOutPoint = 100; // Adjust for how quickly it fades
      const newOpacity = Math.max(1 - scrollY / fadeOutPoint, 0);
      const maxTranslate = 50; // Maximum upward movement in pixels
      const newTranslateY = Math.min(scrollY / 2, maxTranslate);
      setOverlayStyle({ opacity: newOpacity, translateY: newTranslateY });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[60vh]">
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

      {/* Overlay Text (with fade and upward scroll effect) */}
      <div
        className="relative z-10 flex items-center justify-center h-full"
        style={{
          opacity: overlayStyle.opacity,
          transform: `translateY(-${overlayStyle.translateY}px)`,
          transition: "opacity 0.1s linear, transform 0.1s linear",
        }}
      >
        {/* Semi-transparent black overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative px-4 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">
            Behold Our Top Masterpieces
          </h1>
          <p className="mb-8 text-xl">
            There is a lot more where that came from, hehe..
          </p>
        </div>
      </div>

      {/* Fog Vanishing Effect at the Bottom */}
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

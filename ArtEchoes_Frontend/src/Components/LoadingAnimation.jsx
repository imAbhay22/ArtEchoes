import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/Loading/MovingDots.json";

const LoadingAnimation = ({ fadeOut }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black flex flex-col items-center justify-center z-[99999] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="mb-4">
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{ height: "160px", width: "160px" }}
        />
      </div>
      <h1 className="text-4xl font-bold tracking-wide text-white animate-pulse">
        ArtEchoes
      </h1>
    </div>
  );
};
export default LoadingAnimation;

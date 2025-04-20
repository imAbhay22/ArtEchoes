import React, { createContext, useContext, useState, useEffect } from "react";
import image1 from "../assets/Images/jess-bailey-l3N9Q27zULw-unsplash.jpg";
import image2 from "../assets/Images/kelly-sikkema-Rq1MLxP5RgI-unsplash.jpg";
import image3 from "../assets/Images/kelly-sikkema-L5HG3CH_pgc-unsplash.jpg";
import image4 from "../assets/Images/mike-tinnion-3ym6i13Y9LU-unsplash.jpg";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [threeDArtworks, setThreeDArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroImages = [image1, image2, image3, image4];

  const fetchArtworks = async () => {
    try {
      const apiUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:5000/api/artworks"
          : "http://192.168.1.100:5000/api/artworks";

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch artworks");

      const data = await response.json();
      setArtworks(data.artworks || []);
    } catch (err) {
      console.error("Error fetching artworks:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchThreeDArtworks = async () => {
    try {
      const apiUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:5000/api/3d-artworks"
          : "http://192.168.1.100:5000/api/3d-artworks";

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch 3D artworks");

      const data = await response.json();
      setThreeDArtworks(data.artworks || []);
    } catch (err) {
      console.error("Error fetching 3D artworks:", err);
    }
  };

  useEffect(() => {
    fetchArtworks();
    fetchThreeDArtworks();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        currentHeroIndex,
        setCurrentHeroIndex,
        heroImages,
        artworks,
        threeDArtworks,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        fetchArtworks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

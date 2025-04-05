import React, { useState, useEffect, useContext } from "react";
import "./App.css";

import {
  Navigation,
  Sidebar,
  Footer,
  AuthPopUpHomePage,
  useAuth,
  ScrollToTop,
  AppRoutes,
} from "./Components";

import { DarkContext } from "./Components/Mode/DarkContext";

const App = () => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const { darkMode } = useContext(DarkContext);
  const modeClass = darkMode ? "dark-mode" : "light-mode";

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 100000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <div
      className={`flex min-h-screen ${modeClass} ${
        darkMode
          ? "bg-gradient-to-b from-[#141b2d] to-[#0e1015] text-[#f1f1f1]"
          : "bg-gradient-to-b from-[#f4f1ee] to-[#e8e6e1] text-[#1a1a1a]"
      }`}
    >
      <ScrollToTop />
      <Sidebar />
      <div className="relative w-full">
        <Navigation />
        {showModal && !isAuthenticated && <AuthPopUpHomePage />}
        <div className="pt-20">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default App;

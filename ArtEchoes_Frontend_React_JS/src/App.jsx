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
  LoadingAnimation,
} from "./Components";

import { DarkContext } from "./Components/Mode/DarkContext";

const App = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 500 - elapsed);
      setTimeout(() => {
        setFadeOut(true); // trigger fade out
        setTimeout(() => setLoadingPage(false), 200);
      }, delay);
    };

    if (document.readyState == "complete") {
      handleLoad();
    } else {
      document.addEventListener("load", handleLoad());
    }
    return () => window.removeEventListener("load", handleLoad());
  }, []);

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
    <>
      {loadingPage && <LoadingAnimation fadeOut={fadeOut} />}
      {!loadingPage && (
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
      )}
    </>
  );
};

export default App;

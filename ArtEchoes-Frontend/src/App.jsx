import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AppProvider,
  AuthProvider,
  Navigation,
  HeroSection,
  Sidebar,
  Footer,
  PaintingsPage,
  ArtDetailModal,
  TraditionalArt,
  UploadArt,
  AboutUs,
  AboutUsHome,
  ContactUs,
  WeeklyTopArt,
  AuthPopUpHomePage,
  FeaturedArtistsCarousel,
  SignUp,
  Login,
  ForgotPassword,
  ResetPassword,
  ProfilePage,
  OilPainting,
  Watercolor,
  Sketch,
  DigitalArt,
  Sculpture,
  Photography,
  MixedMedia,
  Collage,
  AbstractArt,
  Impressionism,
  PopArt,
  Minimalism,
  ConceptualArt,
  Printmaking,
  useAuth,
} from "./Components";

const MainApp = () => {
  // Now we can use the useAuth hook to check if the user is authenticated
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // If the user is not authenticated, set a 2-minute timer to show the modal
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 10000); // 2 minutes = 120000 ms

      // Clear the timer if the user logs in before the 2 minutes are up
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-800 to-white flex">
      <Sidebar />
      <div className="w-full relative">
        <Navigation />
        {/* Show the modal only if the user is not logged in */}
        {showModal && !isAuthenticated && <AuthPopUpHomePage />}
        <div className="pt-20">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <h2 className="text-4xl mt-15 ml-10 font-bold mb-4 text-left">
                    Collection :
                  </h2>
                  <h2 className="text-xl font-bold mb-4 text-center">
                    This Week's top Art, rated by yours truly, hehe..
                  </h2>
                  <WeeklyTopArt />
                  <FeaturedArtistsCarousel />
                  <AboutUsHome />
                </>
              }
            />
            <Route path="/paintings" element={<PaintingsPage />} />
            <Route path="/artwork/:id" element={<ArtDetailModal />} />

            {/* New routes for each category */}
            <Route path="/oil-painting" element={<OilPainting />} />
            <Route path="/watercolor" element={<Watercolor />} />
            <Route path="/sketch" element={<Sketch />} />
            <Route path="/digital-art" element={<DigitalArt />} />
            <Route path="/sculpture" element={<Sculpture />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/mixed-media" element={<MixedMedia />} />
            <Route path="/collage" element={<Collage />} />
            <Route path="/abstract-art" element={<AbstractArt />} />
            <Route path="/impressionism" element={<Impressionism />} />
            <Route path="/pop-art" element={<PopArt />} />
            <Route path="/minimalism" element={<Minimalism />} />
            <Route path="/conceptual-art" element={<ConceptualArt />} />
            <Route path="/printmaking" element={<Printmaking />} />

            <Route path="/traditional-art" element={<TraditionalArt />} />
            <Route path="/upload" element={<UploadArt />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;

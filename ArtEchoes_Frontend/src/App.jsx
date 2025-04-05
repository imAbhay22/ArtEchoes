import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import {
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
  AIArt,
  VectorArt,
  ThreeDArt,
  Minimalism,
  ConceptualArt,
  Printmaking,
  AcrylicPainting,
  PortraitPainting,
  LandscapePainting,
  ModernArt,
  StreetArt,
  Realism,
  Surrealism,
  useAuth,
  InfiniteScroll,
} from "./Components";
import weeklyImage1 from "./assets/Images/weekly1.jpg";
import ArtGrid from "./Components/ArtGrid";
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

  const WeeklyTopArt = [
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
    <div
      className={`flex min-h-screen ${modeClass} ${
        darkMode
          ? "bg-gradient-to-b from-[#141b2d] to-[#0e1015] text-[#f1f1f1]"
          : "bg-gradient-to-b from-[#f4f1ee] to-[#e8e6e1] text-[#1a1a1a]"
      }`}
    >
      <Sidebar />
      <div className="relative w-full">
        <Navigation />
        {showModal && !isAuthenticated && <AuthPopUpHomePage />}
        <div className="pt-20">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <h2 className="mb-4 ml-10 text-4xl font-bold text-center">
                    All Artworks
                  </h2>
                  <InfiniteScroll />
                  <h2 className="mt-10 mb-4 text-xl font-bold text-center">
                    This Week's top Art, rated by yours truly, hehe..
                  </h2>
                  <ArtGrid defaultArtworks={WeeklyTopArt} />
                  <FeaturedArtistsCarousel />
                  <AboutUsHome />
                </>
              }
            />
            <Route path="/paintings" element={<PaintingsPage />} />
            <Route path="/artwork/:id" element={<ArtDetailModal />} />

            {/* Category routes */}
            <Route path="/oil-painting" element={<OilPainting />} />
            <Route path="/watercolor" element={<Watercolor />} />
            <Route path="/acrylic-painting" element={<AcrylicPainting />} />
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
            <Route path="/portrait-painting" element={<PortraitPainting />} />
            <Route path="/landscape-painting" element={<LandscapePainting />} />
            <Route path="/modern-art" element={<ModernArt />} />
            <Route path="/street-art" element={<StreetArt />} />
            <Route path="/realism" element={<Realism />} />
            <Route path="/surrealism" element={<Surrealism />} />
            <Route path="/vector-art" element={<VectorArt />} />
            <Route path="/3d-art" element={<ThreeDArt />} />
            <Route path="/ai-art" element={<AIArt />} />

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

export default App;

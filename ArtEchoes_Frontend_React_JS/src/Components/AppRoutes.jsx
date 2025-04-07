// AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import {
  HeroSection,
  PaintingsPage,
  ArtDetailModal,
  TraditionalArt,
  UploadArt,
  AboutUs,
  ContactUs,
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
  InfiniteScroll,
  FeaturedArtistsCarousel,
} from "./index";

import ArtGrid from "./ArtGrid";
import weeklyImage1 from "../assets/Images/weekly1.jpg";

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

const AppRoutes = () => {
  return (
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
            <AboutUs />
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
  );
};

export default AppRoutes;

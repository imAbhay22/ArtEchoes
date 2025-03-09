export { default as Navigation } from "./Navigation";
export { default as HeroSection } from "./HeroSection";
export { default as Sidebar } from "./Sidebar";
export { default as Footer } from "./Footer";
export { default as PaintingsPage } from "./ArtFiles/PaintingsPage";
export { default as ArtDetailModal } from "./ArtDetailModal";
export { default as TraditionalArt } from "./ArtFiles/TraditionalArt";
export { default as UploadArt } from "./Navigation/Upload";
export { default as AboutUs } from "./Navigation/AboutUs";
export { default as AboutUsHome } from "./AboutUsHome";
export { default as ContactUs } from "./Navigation/ContactUs";
export { default as DigitalArt } from "./ArtFiles/DigitalArt"; // only one digital art component
export { default as WeeklyTopArt } from "./WeeklyTopArt";
export { default as AuthPopUpHomePage } from "./AuthPopUpHomePage";
export { default as FeaturedArtistsCarousel } from "./FeaturedArtistsCarousel";
export { default as SignUp } from "./Navigation/SignUp";
export { default as Login } from "./Navigation/Login";
export { default as ForgotPassword } from "./Account/ForgotPassword";
export { default as ResetPassword } from "./Account/ResetPassword";
export { AppProvider } from "./AppContext";
export { AuthProvider, useAuth } from "./AuthContext";
export { default as ProfilePage } from "./ProfileDropDown/ProfilePage";

// Art category components from the ArtFiles folder
export { default as OilPainting } from "./ArtFiles/OilPainting";
export { default as Watercolor } from "./ArtFiles/Watercolor";
export { default as Sketch } from "./ArtFiles/Sketch";
// DigitalArt is already exported above, so we don't re‑export it here.
export { default as Sculpture } from "./ArtFiles/Sculpture";
export { default as Photography } from "./ArtFiles/Photography";
export { default as MixedMedia } from "./ArtFiles/MixedMedia";
export { default as Collage } from "./ArtFiles/Collage";
export { default as AbstractArt } from "./ArtFiles/AbstractArt";
export { default as Impressionism } from "./ArtFiles/Impressionism";
export { default as PopArt } from "./ArtFiles/PopArt";
export { default as Minimalism } from "./ArtFiles/Minimalism";
export { default as ConceptualArt } from "./ArtFiles/ConceptualArt";
export { default as Printmaking } from "./ArtFiles/Printmaking";

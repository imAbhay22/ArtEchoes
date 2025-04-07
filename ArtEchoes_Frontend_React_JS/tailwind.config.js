export const content = ["./src/**/*.{html,js,jsx,ts,tsx}"];
export const theme = {
  screens: {
    // Default breakpoints
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
    // Custom breakpoints for specific devices
    mobile: { max: "639px" },
    tablet: { min: "640px", max: "1199px" }, // Increased max width for tablets
    laptop: { min: "1200px", max: "1535px" },
    desktop: { min: "1536px" },
  },
};
export const plugins = [];

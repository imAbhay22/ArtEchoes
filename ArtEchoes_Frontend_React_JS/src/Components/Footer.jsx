import { useContext } from "react";
import { DarkContext } from "./Mode/DarkContext";

const Footer = () => {
  const { darkMode } = useContext(DarkContext);

  const modeClass = darkMode ? "dark-mode" : "light-mode";
  return (
    <footer className={` ${modeClass} py-8 text-center`}>
      <p className="text-lg font-semibold">Join us on our journey.</p>
      <div className="flex justify-center mt-4 space-x-4">
        {["🌟", "✨", "🎨", "💫", "🔥"].map((emoji, index) => (
          <span
            key={index}
            className="text-2xl animate-bounce"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {emoji}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm">© 2025 ArtEchoes. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a
          href="https://www.instagram.com/sketch_.otaku/"
          className="hover:text-[#d6b28d]"
          target="_blank"
          rel="noopener noreferrer" // it is important to add this to prevent security issues
        >
          Instagram
        </a>
        <a
          href="https://github.com/imAbhay22"
          className="hover:text-[#d6b28d] "
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/abhay-choudhary-/"
          className="hover:text-[#d6b28d]"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
};

export default Footer;

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-gray-300 py-8 text-center">
      <p className="text-lg font-semibold">Join us on our journey.</p>
      <div className="mt-4 flex justify-center space-x-4">
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
      <p className="mt-4 text-sm">© 2025 ArtEcho. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="#terms" className="hover:text-[#d6b28d]">
          Terms
        </a>
        <a href="#privacy" className="hover:text-[#d6b28d]">
          Privacy
        </a>
        <a href="#contact" className="hover:text-[#d6b28d]">
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SecondaryNav = () => {
  // Consistent navigation link styles
  const navLink =
    "whitespace-nowrap text-gray-200 hover:text-[#d6b28d] transition-colors border-b-2 border-transparent hover:border-yellow-300 pb-1 text-sm font-semibold";

  return (
    <div className="relative flex items-center justify-center border-t border-b border-gray-600 xl:hidden bg-neutral-800">
      {/* Scroll container with hidden scrollbar */}
      <div className="px-8 py-3 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-8 min-w-max">
          {/* Left logo (optional for scroll navigation) */}
          <div className="flex-shrink-0 text-gray-200 cursor-pointer">
            <FiChevronLeft className="w-5 h-5" />
          </div>

          {/* Navigation links */}
          <div className="flex space-x-8 flex-nowrap">
            <Link to="/painting" className={navLink}>
              Painting
            </Link>
            <Link to="/digital-art" className={navLink}>
              Digital Art
            </Link>
            <Link to="/traditional-art" className={navLink}>
              Traditional Art
            </Link>
            <Link to="/upload" className={navLink}>
              Upload
            </Link>
            <Link to="/about-us" className={navLink}>
              About Us
            </Link>
            <Link to="/contact-us" className={navLink}>
              Contact Us
            </Link>
          </div>

          {/* Right logo (optional for scroll navigation) */}
          <div className="flex-shrink-0 text-gray-200 cursor-pointer">
            <FiChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;

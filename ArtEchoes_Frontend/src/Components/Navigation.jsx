import { useAppContext } from "./AppContext";
import { FaCaretLeft } from "react-icons/fa";
import Logo from "./Navigation/Logo";
import InboxIcon from "./Navigation/InboxIcon";
import SearchBar from "./Navigation/SearchBar";
import ProfileDropdown from "./Navigation/ProfileDropdown";
import { Link } from "react-router-dom";
import NavDropdown from "./Navigation/NavDropDown";
import SecondaryNav from "./Navigation/SecondaryNav";

const Navigation = () => {
  const { setSearchQuery } = useAppContext();

  // Updated dropdown configurations with separate digital art options
  const dropdowns = [
    {
      title: "Traditional Art",
      options: [
        { label: "Oil Painting", to: "/oil-painting" },
        { label: "Watercolor", to: "/watercolor" },
        { label: "Sketch", to: "/sketch" },
      ],
      defaultTo: "/oil-painting",
    },
    {
      title: "Digital Art",
      options: [
        { label: "AI Art", to: "/ai-art" },
        { label: "3D Art", to: "/3d-art" },
        { label: "Vector Art", to: "/vector-art" },
      ],
      defaultTo: "/digital-art",
    },
    {
      title: "Other Art",
      options: [
        { label: "Sculpture", to: "/sculpture" },
        { label: "Photography", to: "/photography" },
        { label: "Mixed Media", to: "/mixed-media" },
        { label: "Collage", to: "/collage" },
        { label: "Abstract Art", to: "/abstract-art" },
        { label: "Impressionism", to: "/impressionism" },
        { label: "Pop Art", to: "/pop-art" },
        { label: "Minimalism", to: "/minimalism" },
        { label: "Conceptual Art", to: "/conceptual-art" },
        { label: "Printmaking", to: "/printmaking" },
      ],
      defaultTo: "/sculpture",
    },
  ];

  const navLink =
    "whitespace-nowrap text-gray-200 hover:text-[#d6b28d] transition-colors border-b-2 border-transparent hover:border-yellow-300 pb-1 text-lg font-semibold";
  // adding a comment for no good reason at all
  return (
    <>
      <nav className="bg-neutral-800 shadow-md min-h-22 fixed w-full top-0 z-50 p-3">
        <div className="xl:max-w-7xl max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0 w-24 xl:w-32 transform xl:-translate-x-4">
              <Logo />
            </div>
            <div className="hidden xl:flex items-center space-x-8">
              {dropdowns.map((dropdown, index) => (
                <NavDropdown
                  key={index}
                  title={<span className={navLink}>{dropdown.title}</span>}
                  options={dropdown.options}
                  defaultTo={dropdown.defaultTo}
                />
              ))}
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
            <div className="flex items-center text-gray-200 space-x-4 flex-1 ml-5 xl:flex-none xl:ml-0 justify-end">
              <SearchBar
                setSearchQuery={setSearchQuery}
                className="w-28 md:w-48 xl:w-64"
              />
              <InboxIcon className="hidden xl:block" />
              <ProfileDropdown />
            </div>
          </div>
        </div>
        <div className="xl:hidden mt-2 "></div>
        <SecondaryNav />
      </nav>
    </>
  );
};

export default Navigation;

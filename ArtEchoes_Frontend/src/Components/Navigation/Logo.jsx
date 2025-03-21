import { Link } from "react-router-dom";

const Logo = () => (
  <div className="flex items-center">
    <Link to="/" className="text-3xl md:text-4xl lg:text-5xl font-bold">
      <img src="/white_logo.svg" alt="Logo" className="h-12 cursor-pointer" />
    </Link>
  </div>
);

export default Logo;

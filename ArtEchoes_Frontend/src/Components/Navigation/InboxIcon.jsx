import { Link } from "react-router-dom";

const InboxIcon = () => (
  <Link to="/inbox" className="relative">
    <svg
      className="w-8 h-8 text-gray hover:text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 4v6a2 2 0 002 2h14a2 2 0 002-2v-6M3 8l9 6 9-6"
      />
    </svg>
  </Link>
);

export default InboxIcon;

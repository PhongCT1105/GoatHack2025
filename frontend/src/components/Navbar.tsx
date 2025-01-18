import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
      {/* Left Side: Resume Name */}
      <div className="text-xl font-bold">
        Name of Resume
      </div>

      {/* Right Side: Navigation Links */}
      <ul className="flex space-x-6">
        <li>
          <Link
            to="/"
            className="font-bold hover:text-gray-400 transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/build-resume"
            className="font-bold hover:text-gray-400 transition-colors duration-200"
          >
            Build Resume
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="font-bold hover:text-gray-400 transition-colors duration-200"
          >
            About
          </Link>
        </li>
      </ul>

    </nav>
  );
};

export default Navbar;

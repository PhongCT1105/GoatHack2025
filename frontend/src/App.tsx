import './App.css'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import BuildResume from './pages/BuildResume';
import CoverLetter from './pages/CoverLetter'

function App() {
  // Add state to control navbar visibility at the app level
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  return (
    <Router>
      <div>
        {/* Navbar with visibility controlled by state */}
        <nav className={`flex justify-between items-center bg-[#59198B] p-4 text-white ${!isNavbarVisible ? 'hidden' : ''}`}>
          <div className="text-xl font-bold">
            Repo2Resume
          </div>

          <ul className="flex space-x-10">
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
                to="/cover-letter"
                className="font-bold hover:text-gray-400 transition-colors duration-200"
              >
                Cover Letter
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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/build-resume" element={<BuildResume />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/cover-letter" 
            element={<CoverLetter setNavbarVisible={setIsNavbarVisible} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App
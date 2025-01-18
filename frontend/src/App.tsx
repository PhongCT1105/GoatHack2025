import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import BuildResume from './pages/BuildResume';

function App() {

  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="flex justify-between items-center bg-[#59198B] p-4 text-white">
          {/* Left side: Resume name */}
          <div className="text-xl font-bold">
            aiResumeBuilder
          </div>

          {/* Right side: Navigation links */}
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
                to="/about"
                className="font-bold hover:text-gray-400 transition-colors duration-200"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/build-resume" element={<BuildResume />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

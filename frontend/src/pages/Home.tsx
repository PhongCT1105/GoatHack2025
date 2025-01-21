import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import GoatHack from "../assets/GoatHack.png";
import MLH from "../assets/MLH.png";
import Carousel1 from "../assets/Image1.png";
import Carousel2 from "../assets/Image2.png";
import Carousel3 from "../assets/Image3.jpg";
import { Link } from "react-router-dom";



const Home = () => {
  const sections = [
    {
      title: "Build Your Resume from GitHub 🚀",
      description:
        "Transform your GitHub projects into a professional resume in just a few clicks. Highlight your contributions and impress recruiters!",
      image: Carousel1,
      link: "/build-resume", // Add the route
    },
    {
      title: "Generate Cover Letters Effortlessly ✍️",
      description:
        "Create personalized cover letters tailored to each job application. Save time and make a lasting impression.",
      image: Carousel2,
      link: "/cover-letter", // Add the route
    },
    {
      title: "Tinder for Job Hunting 💼",
      description:
        "Swipe through job opportunities and match with roles that align with your skills and preferences. Job searching made fun and effective!",
      image: Carousel3,
      link: "/swipe-job", // Add the route
    },
  ];
  
  
  
  

  // Custom Arrow Component
  const CustomArrow: React.FC<{ onClick: () => void; direction: string }> = ({
    onClick,
    direction,
  }) => {
    const isLeft = direction === "left";
    return (
      <button
        onClick={onClick}
        className={`absolute top-1/2 transform -translate-y-1/2 ${
          isLeft ? "left-4" : "right-4"
        } bg-[#59198B] text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all`}
        style={{ zIndex: 2 }}
      >
        {isLeft ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </button>
    );
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-indigo-200">
      {/* Header */}
      <header className="text-center py-12 bg-purple-600 text-white shadow-lg">
  <h1 className="text-5xl font-bold">Your Career Buddy</h1>
  <p className="text-lg mt-4">
    Simplify your job search journey with AI-powered tools for resumes, cover letters, and job matching.
  </p>

</header>


      {/* Main Carousel Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto">
        <Carousel
  showThumbs={false}
  showStatus={false}
  infiniteLoop
  useKeyboardArrows
  autoPlay
  interval={5000}
  className="rounded-xl shadow-lg"
  renderArrowPrev={(onClickHandler, hasPrev) =>
    hasPrev && <CustomArrow onClick={onClickHandler} direction="left" />
  }
  renderArrowNext={(onClickHandler, hasNext) =>
    hasNext && <CustomArrow onClick={onClickHandler} direction="right" />
  }
  renderIndicator={(onClickHandler, isSelected, index) => (
    <button
      onClick={onClickHandler}
      className={`w-3 h-3 rounded-full mx-1 ${
        isSelected
          ? "bg-purple-600"
          : "bg-purple-300 hover:bg-purple-400"
      } transition-all`}
      aria-label={`Slide ${index + 1}`}
      key={index}
    />
  )}
>
{sections.map((section, index) => (
  <div
    key={index}
    className="flex flex-col items-center justify-center gap-6 px-8 py-12"
  >
    {/* Text Section */}
    <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">{section.title}</h2>
      <p className="text-lg text-gray-700">{section.description}</p>
      <Link to={section.link}>
        <button className="mt-6 px-6 py-3 bg-[#59198B] text-white font-semibold rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md">
          Learn More
        </button>
      </Link>
    </div>
    {/* Image Section */}
    <div className="w-full max-w-3xl h-96 rounded-xl shadow-lg overflow-hidden">
      <img
        src={section.image}
        alt={section.title}
        className="w-full h-full object-cover"
      />
    </div>
  </div>
))}

</Carousel>


        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <div className="flex items-center justify-center gap-8 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img src={GoatHack} alt="GoatHacks 2025 Winner" className="h-24 object-contain" />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img src={MLH} alt="MLH Logo" className="h-24 object-contain" />
      </div>
    </div>
    <p className="text-lg font-bold">GoatHacks 2025</p>
    <p className="text-sm mb-4">Winner of Best Software and Best Use of Terraform</p>
    <p className="text-xs">&copy; Created by Phong Cao. All Rights Reserved.</p>
  </div>
</footer>




    </div>
  );
};

export default Home;

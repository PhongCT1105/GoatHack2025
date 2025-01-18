import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import DisplayLottie from '../components/DisplayLottie'
import codingPerson from '../assets/codingPerson.json'
import build from '../assets/build.json'
import landingPerson from '../assets/landingPerson.json'

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

function Section({ content, id }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 300);

  return (
    <section className="h-screen snap-start flex justify-center items-center relative">
      {id === 1 ? (
        // Section 1: Coding Person Animation (Left) + Text (Right)
        <div
          ref={ref}
          className="max-w-6xl w-full flex items-center justify-between px-12"
        >
          <div className="w-1/2 max-w-lg">
            <DisplayLottie animationData={landingPerson} />
          </div>

          <div className="w-1/2 text-left bg-white/80 backdrop-blur-sm p-12 rounded-xl">
            <h2 className="text-5xl font-bold mb-6 tracking-tight">
              {content.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">{content.description}</p>
            <Link to="/build-resume">
              <button className="px-8 py-3 bg-[#59198B] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                {content.action}
              </button>
            </Link>
          </div>
        </div>
      ) : id === 2 ? (
        // Section 2: Text on the Left, Lottie Animation on the Right
        <div
          ref={ref}
          className="max-w-6xl w-full flex items-center justify-between px-12"
        >
          {/* Text on the Left */}
          <div className="w-1/2 text-left bg-white/80 backdrop-blur-sm p-12 rounded-xl">
            <h2 className="text-5xl font-bold mb-6 tracking-tight">
              {content.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">{content.description}</p>
          </div>
      
          {/* Lottie Animation on the Right */}
          <div className="w-1/2 max-w-lg">
            <DisplayLottie animationData={codingPerson} />
          </div>
        </div>
      ) : id === 3 ? (
        // Section 2: Placeholder for Future Animation
        <div
          ref={ref}
          className="max-w-6xl w-full flex items-center justify-between px-12"
        >
          <div className="w-1/2 max-w-lg">
            {/* Placeholder Lottie Animation for Section 2 */}
            <DisplayLottie animationData={build} />
          </div>

          <div className="w-1/2 text-left bg-white/80 backdrop-blur-sm p-12 rounded-xl">
            <h2 className="text-5xl font-bold mb-6 tracking-tight">
              {content.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">{content.description}</p>
          </div>
        </div>
      ) : (
        // Default Layout for Other Sections
        <div
          ref={ref}
          className="max-w-2xl text-center bg-white/80 backdrop-blur-sm p-12 rounded-xl"
        >
          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            {content.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8">{content.description}</p>
        </div>
      )}
    </section>
  );
}

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const sections = [
    {
      title: "Welcome to Resume Builder",
      description: "Start building your professional resume today",
      action: "Get Started"
    },
    {
      title: "Our AI will help you in building your resume",
      description: "Type in your github link and voila!",
    },
    {
      title: "Not satisfied with the results?",
      description: "You can customize it with your choices!",
    },
  ];

  return (
    <>
      <div className="min-h-screen w-full">
        {sections.map((section, index) => (
          <Section key={index + 1} content={section} id={index + 1} />
        ))}
        <motion.div
          className="fixed left-0 right-0 h-1 bg-[#59198B] bottom-8 origin-left"
          style={{ scaleX }}
        />
      </div>
      <style jsx global>{`
        html {
          scroll-snap-type: y mandatory;
          overflow-x: hidden;
        }

        body {
          margin: 0;
          padding: 0;
        }

        .snap-start {
          scroll-snap-align: start;
        }

        h3 {
          left: calc(50% + 340px);
          top: calc(50% - 25px);
          color: #e5e7eb;
        }
      `}</style>
    </>
  );
};

export default Home;
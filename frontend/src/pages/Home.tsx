import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

function Section({ content, id }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 300);

  return (
    <section className="h-screen snap-start flex justify-center items-center relative">
      <div ref={ref} className="max-w-2xl text-center bg-white/80 backdrop-blur-sm p-12 rounded-xl shadow-lg">
        <h2 className="text-5xl font-bold mb-6 tracking-tight">
          {content.title}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {content.description}
        </p>
        {id === 1 ? (
          <Link to="/build-resume">
            <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
              {content.action}
            </button>
          </Link>
        ) : (
          <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
            {content.action}

          </button>
        )}
      </div>
      <motion.h3
        className="absolute font-mono text-5xl font-bold tracking-tight"
        style={{ y }}
        initial={{ visibility: "hidden" }}
        animate={{ visibility: "visible" }}
      >
        #{String(id).padStart(3, '0')}
      </motion.h3>
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
      title: "Choose Templates",
      description: "Select from our professional templates",
      action: "Browse Templates"
    },
    {
      title: "Easy Customization",
      description: "Customize your resume with our intuitive editor",
      action: "Start Editing"
    },
    {
      title: "Professional Results",
      description: "Get a polished, job-ready resume",
      action: "See Examples"
    },
    {
      title: "Ready to Begin?",
      description: "Create your perfect resume now",
      action: "Create Resume"
    }
  ];

  return (
    <>
      <div className="min-h-screen w-full">
        {sections.map((section, index) => (
          <Section key={index + 1} content={section} id={index + 1} />
        ))}
        <motion.div
          className="fixed left-0 right-0 h-1 bg-blue-500 bottom-8 origin-left"
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
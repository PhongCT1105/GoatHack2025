import React from 'react';

const BuildResume = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Build Your Resume</h1>
        <p className="text-lg text-gray-600">
          Use this page to create a professional resume tailored to your needs.
        </p>
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition">
          Start Building
        </button>
      </div>
    </div>
  );
};

export default BuildResume;

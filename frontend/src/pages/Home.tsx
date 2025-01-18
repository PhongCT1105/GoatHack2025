const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to the Resume Builder</h1>
        <p className="text-lg text-gray-600">
          Start building your professional resume today. Choose one of the options in the navigation above.
        </p>
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

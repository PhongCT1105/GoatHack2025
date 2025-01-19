import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const SwipeJob = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [lovedJobs, setLovedJobs] = useState([]);

    // Handle query input change
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Handle search submission
    const handleSearch = async () => {
        if (!query.trim()) return;

        try {
            const response = await axios.post('http://localhost:8000/api/search', { query }); // Replace with your backend API endpoint
            setResults(response.data.similarJobs || []);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    // Handle swipe right to "Love" a job
    const handleSwipeRight = (job) => {
        setLovedJobs([...lovedJobs, job]);
        setResults(results.slice(1)); // Remove the first job to show the next one
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex">
            {/* Tinder Section */}
            <div className="w-7/12 flex flex-col items-center border-r border-gray-300">
                <header className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-6 shadow-md">
                    <h1 className="text-center text-4xl font-extrabold tracking-wide">Tinder for Jobs</h1>
                    <div className="flex justify-center mt-6">
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Enter your query"
                            className="px-4 py-3 w-2/3 max-w-lg border-2 border-white rounded-l-full focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-white text-blue-600 px-6 py-3 rounded-r-full font-bold hover:bg-blue-100 transition-all"
                        >
                            Search
                        </button>
                    </div>
                </header>

                <main className="flex-grow w-full max-w-2xl mt-10 flex flex-col items-center">
                    <div className="relative w-full h-96 flex justify-center items-center">
                        <AnimatePresence>
                            {results.length > 0 ? (
                                <motion.div
                                    key={results[0].id}
                                    className="absolute w-80 h-96 bg-white shadow-xl rounded-3xl p-6 flex flex-col justify-between"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: 200 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-600 mb-2">{results[0].job_title}</h3>
                                        <p className="text-sm text-gray-700 mb-1">Company: {results[0].company_name}</p>
                                        <p className="text-sm text-gray-700 mb-1">Base Salary: {results[0].base_salary}</p>
                                        <p className="text-sm text-gray-700 mb-1">Country: {results[0].country_code}</p>
                                        <p className="text-sm text-gray-700 mb-4">Description: {results[0].description}</p>
                                    </div>
                                    <div className="flex justify-around">
                                        <button
                                            onClick={() => handleSwipeRight(results[0])}
                                            className="px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-all"
                                        >
                                            Love
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <p className="text-lg text-gray-500">No more jobs available. Try a new search!</p>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Loved Projects Section */}
            <div className="w-5/12 bg-white p-6 overflow-y-auto">
                <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">Loved Projects</h2>
                <div className="space-y-4">
                    {lovedJobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-gray-100 shadow-md p-4 rounded-xl text-gray-800 flex flex-col items-start"
                        >
                            <h3 className="text-lg font-bold">{job.job_title}</h3>
                            <p className="text-sm">Company: {job.company_name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SwipeJob;

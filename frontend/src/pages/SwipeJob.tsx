import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface Job {
    id: number;
    job_title: string;
    company_name: string;
    country_code: string;
    description: string;
}

const SwipeJob = () => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Job[]>([]);
    const [lovedJobs, setLovedJobs] = useState<Job[]>([]);
    const [error, setError] = useState<string>('');
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

    // Define swipe threshold
    const SWIPE_THRESHOLD = 100;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSearch = async () => {
        if (!query.trim()) return;

        try {
            const response = await axios.post('http://localhost:8000/api/search', { query });
            if (response.data?.similarJobs) {
                setResults(response.data.similarJobs);
            } else {
                setResults([]);
            }
            setError('');
        } catch (error) {
            console.error('Error fetching results:', error);
            setError('Failed to fetch jobs. Please try again.');
        }
    };

    const handleSwipeRight = (job: Job) => {
        setExitDirection('right');
        setLovedJobs([...lovedJobs, job]);
        setTimeout(() => {
            setResults(results.slice(1));
            setExitDirection(null);
        }, 200);
    };

    const handleSwipeLeft = () => {
        setExitDirection('left');
        setTimeout(() => {
            setResults(results.slice(1));
            setExitDirection(null);
        }, 200);
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipe = info.offset.x;
        if (Math.abs(swipe) > SWIPE_THRESHOLD) {
            if (swipe > 0) {
                handleSwipeRight(results[0]);
            } else {
                handleSwipeLeft();
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
        >
            <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex">
                <div className="w-7/12 flex flex-col items-center border-r border-gray-300">
                    <header className="w-full bg-gradient-to-r from-[#59198B] to-[#9B4BC6] text-white py-6 shadow-md">
                        <h1 className="text-center text-4xl font-extrabold tracking-wide">Tinder for Jobs</h1>
                        <div className="flex justify-center mt-6">
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Enter your query"
                                className="px-4 py-3 w-2/3 max-w-lg border-white text-black rounded-l-full"
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
                            <AnimatePresence mode="wait">
                                {error && <p className="text-lg text-red-500">{error}</p>}
                                {results.length > 0 && (
                                    <motion.div
                                        key={results[0].id}
                                        className="absolute w-80 h-96 bg-white shadow-xl rounded-3xl p-6 flex flex-col cursor-grab active:cursor-grabbing"
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1, x: 0 }}
                                        exit={exitDirection === 'left'
                                            ? { x: -300, opacity: 0, transition: { duration: 0.2 } }
                                            : exitDirection === 'right'
                                                ? { x: 300, opacity: 0, transition: { duration: 0.2 } }
                                                : { opacity: 0 }
                                        }
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={handleDragEnd}
                                        whileDrag={{ scale: 1.05 }}
                                    >
                                        <div className="flex flex-col h-full">
                                            {/* Title section - 1/4 of the space */}
                                            <div className="h-1/4 mb-4">
                                                <h3 className="text-xl font-bold text-blue-600 line-clamp-2 overflow-hidden">
                                                    {results[0].job_title}
                                                </h3>
                                            </div>

                                            {/* Company and country info - remaining space */}
                                            <div className="flex-1 overflow-hidden">
                                                <div className="space-y-2">
                                                    <p className="text-lg font-bold text-gray-700 line-clamp-2">
                                                        Company: {results[0].company_name}
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        Country: {results[0].country_code}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Buttons section */}
                                            <div className="flex justify-between mt-auto pt-4">
                                                <button
                                                    onClick={() => handleSwipeLeft()}
                                                    className="px-6 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-all"
                                                >
                                                    Dislike
                                                </button>
                                                <button
                                                    onClick={() => handleSwipeRight(results[0])}
                                                    className="px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-all"
                                                >
                                                    Love
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {results.length === 0 && (
                                    <p className="text-lg text-gray-500">No jobs available. Try a new search!</p>
                                )}
                            </AnimatePresence>
                        </div>
                    </main>
                </div>

                <div className="w-5/12 bg-white p-6 overflow-y-auto">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">Loved Jobs</h2>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {lovedJobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: 300 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -300 }}
                                    className="bg-gray-100 shadow-md p-4 rounded-xl text-gray-800 flex flex-col items-start"
                                >
                                    <h3 className="text-lg font-bold">{job.job_title}</h3>
                                    <p className="text-sm">Company: {job.company_name}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SwipeJob;
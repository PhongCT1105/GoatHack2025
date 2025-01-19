import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnterName from '../components/EnterName';
import EnterJobDetails from '../components/EnterJobDetails';
import WorkingSkills from '../components/WorkingSkills';
import ProgressBar from '../components/ProgressBar';
import axios from 'axios';

type CreateNewLetterProps = {
    onBackToHome: () => void;
};

const CreateNewLetter: React.FC<CreateNewLetterProps> = ({ onBackToHome }) => {
    const [section, setSection] = useState<'name' | 'job' | 'skills' | 'result'>('name');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const totalSteps = 3; // Total steps in the process
    const currentStep = section === 'name' ? 1 : section === 'job' ? 2 : section === 'skills' ? 3 : 4;

    const handleSubmit = async () => {
        const payload = {
            fullName: `${firstName} ${lastName}`,
            jobTitle,
            companyName,
            jobDescription,
            skills: selectedSkills,
        };

        setLoading(true); // Show loading animation
        try {
            const response = await axios.post('http://localhost:8000/api/generate-cover-letter', payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                setCoverLetter(response.data.coverLetter);
                setSection('result');
            } else {
                console.error('Failed to generate cover letter:', response.statusText);
            }
        } catch (error: any) {
            console.error('Error generating cover letter:', error.response?.data || error.message);
        } finally {
            setLoading(false); // Hide loading animation
        }
    };

    const handleCopyToClipboard = () => {
        if (coverLetter) {
            navigator.clipboard.writeText(coverLetter);
            alert('Cover letter copied to clipboard!');
        }
    };

    const handleDownload = () => {
        if (coverLetter) {
            const element = document.createElement('a');
            const file = new Blob([coverLetter], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = 'cover_letter.txt';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    const resetForm = () => {
        setSection('name');
        setFirstName('');
        setLastName('');
        setJobTitle('');
        setCompanyName('');
        setJobDescription('');
        setSelectedSkills([]);
        setCoverLetter(null);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 min-w-[256px] h-screen bg-white p-6 fixed left-0">
                <div className="space-y-6">
                    <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                    <div className="mt-6 space-y-6">
                        <div className="flex items-center space-x-4">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    currentStep >= 1 ? 'bg-[#59198B] text-white' : 'bg-gray-300'
                                }`}
                            >
                                1
                            </div>
                            <span className={currentStep === 1 ? 'font-bold' : 'text-gray-500'}>
                                General Information
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    currentStep >= 2 ? 'bg-[#59198B] text-white' : 'bg-gray-300'
                                }`}
                            >
                                2
                            </div>
                            <span className={currentStep === 2 ? 'font-bold' : 'text-gray-500'}>
                                Job Information
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    currentStep >= 3 ? 'bg-[#59198B] text-white' : 'bg-gray-300'
                                }`}
                            >
                                3
                            </div>
                            <span className={currentStep === 3 ? 'font-bold' : 'text-gray-500'}>
                                Skills Selection
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 bg-white">
                <div className="max-w-3xl mx-auto p-8">
                    <motion.div
                        key={section}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        {section === 'name' && (
                            <EnterName
                                firstName={firstName}
                                setFirstName={setFirstName}
                                lastName={lastName}
                                setLastName={setLastName}
                                onContinue={() => setSection('job')}
                                onBack={onBackToHome}
                            />
                        )}
                        {section === 'job' && (
                            <EnterJobDetails
                                jobTitle={jobTitle}
                                setJobTitle={setJobTitle}
                                companyName={companyName}
                                setCompanyName={setCompanyName}
                                jobDescription={jobDescription}
                                setJobDescription={setJobDescription}
                                onBack={() => setSection('name')}
                                onContinue={() => setSection('skills')}
                            />
                        )}
                        {section === 'skills' && (
                            <WorkingSkills
                                selectedSkills={selectedSkills}
                                setSelectedSkills={setSelectedSkills}
                                onBack={() => setSection('job')}
                                onContinue={handleSubmit}
                            />
                        )}
                        {section === 'result' && (
                            <div className="space-y-4">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Generated Cover Letter</h1>
                                <textarea
                                    readOnly
                                    value={coverLetter || ''}
                                    className="border-2 p-4 w-full rounded-lg min-h-[200px] bg-gray-100"
                                />
                                <div className="flex space-x-4">
                                    <button
                                        className="px-6 py-2 bg-[#59198B] text-white rounded-lg"
                                        onClick={handleCopyToClipboard}
                                    >
                                        Copy to Clipboard
                                    </button>
                                    <button
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                                        onClick={handleDownload}
                                    >
                                        Download
                                    </button>
                                    <button
                                        className="px-6 py-2 bg-gray-400 text-white rounded-lg"
                                        onClick={resetForm}
                                    >
                                        Return
                                    </button>
                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                                <div className="w-12 h-12 border-4 border-t-[#59198B] border-gray-300 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewLetter;

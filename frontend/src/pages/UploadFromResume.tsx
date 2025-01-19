import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion'

interface EnterJobDetailsProps {
    onBack: () => void;
    onContinue: () => void;
    jobTitle: string;
    setJobTitle: (value: string) => void;
    companyName: string;
    setCompanyName: (value: string) => void;
    jobDescription: string;
    setJobDescription: (value: string) => void;
}

const EnterJobDetails: React.FC<EnterJobDetailsProps> = ({
    onBack,
    onContinue,
    jobTitle,
    setJobTitle,
    companyName,
    setCompanyName,
    jobDescription,
    setJobDescription
}) => {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Enter the job title, company name, and job description
            </h1>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Job Title"
                    className="border-2 p-4 w-full rounded-lg"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Company Name"
                    className="border-2 p-4 w-full rounded-lg"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <textarea
                    placeholder="Job Description"
                    className="border-2 p-4 w-full rounded-lg min-h-[150px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
            </div>

            <div className="flex justify-between mt-4">
                <button
                    className="px-6 py-2 border-2 border-black hover:bg-gray-100 text-black font-bold rounded-lg"
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    className="px-6 py-2 bg-[#59198B] text-white font-bold rounded-lg"
                    onClick={onContinue}
                    disabled={!jobTitle || !companyName || !jobDescription}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

interface PersonalDetails {
    fullName: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
}

interface Experience {
    company: string;
    role: string;
    duration: string;
    descriptions: string[];
}

type CreateNewLetterProps = {
    onBackToHome: () => void;
    personalDetails: PersonalDetails;
    experiences: Experience[];
};

function UploadFromResume({ onBackToHome, personalDetails, experiences }: CreateNewLetterProps) {
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    useEffect(() => {
        console.log('Received Personal Details:', personalDetails);
        console.log('Received Experiences:', experiences);
    }, [personalDetails, experiences]);

    const handleJobContinue = () => {
        if (jobTitle && companyName && jobDescription) {
            console.log('send to backend')
        }
    };

    return (
        <div className="flex h-screen">
            {/* Left Sidebar - Fixed width */}
            <div className="w-64 min-w-[256px] h-screen bg-white p-6 fixed left-0">
                <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#59198B] text-white">
                            1
                        </div>
                        <span className="text-[#59198B]">Job Information</span>
                    </div>
                </div>
            </div>

            {/* Main Content - Fixed margin for sidebar */}
            <div className="ml-64 flex-1 bg-white">
                <div className="max-w-3xl mx-auto p-8">
                    {/* Motion div for section transition */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <EnterJobDetails
                            jobTitle={jobTitle}
                            setJobTitle={setJobTitle}
                            companyName={companyName}
                            setCompanyName={setCompanyName}
                            jobDescription={jobDescription}
                            setJobDescription={setJobDescription}
                            onBack={onBackToHome}
                            onContinue={handleJobContinue}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default UploadFromResume;

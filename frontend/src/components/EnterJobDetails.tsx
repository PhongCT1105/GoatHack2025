import React from 'react';

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
    setJobDescription,
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
};

export default EnterJobDetails;

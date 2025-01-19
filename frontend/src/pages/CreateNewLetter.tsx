import React, { useState } from 'react';
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


interface EnterNameProps {
    onBack: () => void;
    onContinue: () => void;
    firstName: string;
    setFirstName: (value: string) => void;
    lastName: string;
    setLastName: (value: string) => void;
}

const EnterName: React.FC<EnterNameProps> = ({
    onBack,
    onContinue,
    firstName,
    setFirstName,
    lastName,
    setLastName,
}) => {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Enter your first name and last name
            </h1>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="First Name"
                    className="border-2 p-4 w-full rounded-lg"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    className="border-2 p-4 w-full rounded-lg"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                    disabled={!firstName || !lastName}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}


interface WorkingSkillsProps {
    onBack: () => void;
    onContinue: () => void;
    selectedSkills: string[];
    setSelectedSkills: (skills: string[]) => void;
}

const WorkingSkills: React.FC<WorkingSkillsProps> = ({
    onBack,
    onContinue,
    selectedSkills,
    setSelectedSkills,
}) => {
    const skillsList = [
        "Collaboration",
        "Leadership",
        "Communication",
        "Problem Solving",
        "Time Management",
        "Adaptability",
        "Critical Thinking",
        "Teamwork",
        "Project Management",
        "Creativity",
        "Organization",
        "Attention to Detail",
        "Research",
        "Analysis",
        "Strategic Planning",
        "Decision Making",
        "Customer Service",
        "Technical Proficiency",
        "Innovation",
        "Interpersonal Skills"
    ];

    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Select your working skills
            </h1>
            <div className="grid grid-cols-3 gap-4 mb-8">
                {skillsList.map((skill) => (
                    <div
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${selectedSkills.includes(skill)
                            ? 'border-black bg-[#59198B] text-white'
                            : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <span>{skill}</span>
                        <span className="text-xl">
                            {selectedSkills.includes(skill) ? '✓' : '+'}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4">
                <button
                    className="px-6 py-2 border-2 border-black hover:bg-gray-100 text-black rounded-lg"
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    className="px-6 py-2 bg-[#59198B] text-white rounded-lg"
                    onClick={onContinue}
                    disabled={selectedSkills.length === 0}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

const handleSubmit = async ({
    firstName,
    lastName,
    jobTitle,
    companyName,
    jobDescription,
    selectedSkills,
}: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    selectedSkills: string[];
}) => {
    try {
        const payload = {
            fullName: `${firstName} ${lastName}`,
            jobTitle,
            companyName,
            jobDescription,
            skills: selectedSkills,
        };

        console.log("Payload", payload )

        const response = await fetch('http://localhost:5173/api/generate-cover-letter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Data saved successfully:', result);
            // Handle success (e.g., show a success message or navigate to the next screen)
        } else {
            console.error('Failed to save data:', response.statusText);
            // Handle error (e.g., show an error message)
        }
    } catch (error) {
        console.error('An error occurred while saving data:', error);
        // Handle network errors
    }
};

type CreateNewLetterProps = {
    onBackToHome: () => void;
};

function CreateNewLetter({ onBackToHome }: CreateNewLetterProps) {
    const [section, setSection] = useState('name'); // 'name', 'job', or 'skills'
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const handleNameContinue = () => {
        if (firstName && lastName) {
            setSection('job');
        }
    };

    const handleJobContinue = () => {
        if (jobTitle && companyName && jobDescription) {
            setSection('skills');
        }
    };

    const handleSkillsContinue = () => {
        if (selectedSkills.length > 0) {
            console.log("All details submitted:", {
                firstName,
                lastName,
                jobTitle,
                companyName,
                jobDescription,
                skills: selectedSkills
            });
            // Handle final submission here
        }
    };

    const handleJobBack = () => {
        setSection('name');
    };

    const handleSkillsBack = () => {
        setSection('job');
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
                        <span>General Information</span>
                    </div>
                    <div className="ml-12 space-y-2 text-sm">
                        <div className={`${section === 'name' ? 'text-[#59198B] font-bold' : ''}`}>
                            - Personal Details
                        </div>
                        <div className={`${section === 'job' ? 'text-[#59198B] font-bold' : ''}`}>
                            - Job Information
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center space-x-4 mt-5">
                        <div className={`w-8 h-8 rounded-full flex items-center text-white justify-center ${section === 'skills' ? 'bg-[#59198B]' : 'bg-gray-300'
                            }`}>
                            2
                        </div>
                        <span className={section === 'skills' ? 'text-[#59198B] font-bold' : 'text-gray-400'}>
                            Working Skills
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content - Fixed margin for sidebar */}
            <div className="ml-64 flex-1 bg-white">
                <div className="max-w-3xl mx-auto p-8">
                    {/* Motion div for section transition */}
                    <motion.div
                        key={section}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        {section === 'name' ? (
                            <EnterName
                                firstName={firstName}
                                setFirstName={setFirstName}
                                lastName={lastName}
                                setLastName={setLastName}
                                onContinue={handleNameContinue}
                                onBack={onBackToHome}
                            />
                        ) : section === 'job' ? (
                            <EnterJobDetails
                                jobTitle={jobTitle}
                                setJobTitle={setJobTitle}
                                companyName={companyName}
                                setCompanyName={setCompanyName}
                                jobDescription={jobDescription}
                                setJobDescription={setJobDescription}
                                onBack={handleJobBack}
                                onContinue={handleJobContinue}
                            />
                        ) : (
                            <WorkingSkills
                                selectedSkills={selectedSkills}
                                setSelectedSkills={setSelectedSkills}
                                onBack={handleSkillsBack}
                                onContinue={async () => {
                                    if (selectedSkills.length > 0) {
                                        // Call handleSubmit when "Continue" is pressed
                                        await handleSubmit({
                                            firstName,
                                            lastName,
                                            jobTitle,
                                            companyName,
                                            jobDescription,
                                            selectedSkills,
                                        });
                                    } else {
                                        console.error("No skills selected. Cannot proceed.");
                                    }
                                }}
                            />
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default CreateNewLetter;
import React from 'react';

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
        "Collaboration", "Leadership", "Communication", "Problem Solving",
        "Time Management", "Adaptability", "Critical Thinking", "Teamwork",
        "Project Management", "Creativity", "Organization", "Attention to Detail",
        "Research", "Analysis", "Strategic Planning", "Decision Making",
        "Customer Service", "Technical Proficiency", "Innovation", "Interpersonal Skills",
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
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            selectedSkills.includes(skill) ? 'border-black bg-[#59198B] text-white' : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        <span>{skill}</span>
                        <span className="text-xl">{selectedSkills.includes(skill) ? '✓' : '+'}</span>
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
};

export default WorkingSkills;

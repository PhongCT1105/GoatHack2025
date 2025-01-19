import React from 'react';

interface Experience {
    company: string;
    role: string;
    duration: string;
    descriptions: string[];
}

interface ExperienceProps {
    experiences: Experience[];
    onExperienceChange: (experiences: Experience[]) => void;
    expanded: boolean;
    onToggle: () => void;
}

const ExperienceSection: React.FC<ExperienceProps> = ({
    experiences,
    onExperienceChange,
    expanded,
    onToggle
}) => {
    const handleAddExperience = () => {
        onExperienceChange([...experiences, {
            company: "",
            role: "",
            duration: "",
            descriptions: [""]
        }]);
    };

    const handleDeleteExperience = (expIndex: number) => {
        const newExperiences = experiences.filter((_, index) => index !== expIndex);
        onExperienceChange(newExperiences);
    };

    const handleAddDescription = (expIndex: number) => {
        const newExperiences = [...experiences];
        newExperiences[expIndex].descriptions.push("");
        onExperienceChange(newExperiences);
    };

    const handleDeleteDescription = (expIndex: number, descIndex: number) => {
        const newExperiences = [...experiences];
        newExperiences[expIndex].descriptions.splice(descIndex, 1);
        onExperienceChange(newExperiences);
    };

    const handleFieldChange = (expIndex: number, field: keyof Experience, value: string) => {
        const newExperiences = [...experiences];
        if (field === 'descriptions') return;
        newExperiences[expIndex][field] = value;
        onExperienceChange(newExperiences);
    };

    const handleDescriptionChange = (expIndex: number, descIndex: number, value: string) => {
        const newExperiences = [...experiences];
        newExperiences[expIndex].descriptions[descIndex] = value;
        onExperienceChange(newExperiences);
    };

    return (
        <div className="mb-4">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3"
            >
                <span className="font-medium text-gray-700">Experience</span>
                <span className={`transform transition-transform ${expanded ? "rotate-180" : ""}`}>▼</span>
            </button>

            {expanded && (
                <div className="space-y-3 p-4">
                    {experiences.map((exp, expIndex) => (
                        <div key={expIndex} className="group relative border p-4 rounded-lg">
                            <button
                                onClick={() => handleDeleteExperience(expIndex)}
                                className="absolute -top-2 -right-2 text-gray-500 hover:text-red-600 bg-gray-200 rounded-full p-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md transition-all duration-200"
                            >
                                <span className="text-xs">✕</span>
                            </button>

                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleFieldChange(expIndex, 'company', e.target.value)}
                                placeholder="Company Name"
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => handleFieldChange(expIndex, 'role', e.target.value)}
                                placeholder="Role"
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => handleFieldChange(expIndex, 'duration', e.target.value)}
                                placeholder="Duration"
                                className="w-full p-2 border rounded mb-2"
                            />
                            
                            <div className="space-y-2 mt-2">
                                {exp.descriptions.map((desc, descIndex) => (
                                    <div key={descIndex} className="flex items-center">
                                        <input
                                            type="text"
                                            value={desc}
                                            onChange={(e) => handleDescriptionChange(expIndex, descIndex, e.target.value)}
                                            placeholder="Description"
                                            className="w-full p-2 border rounded mb-2"
                                        />
                                        <button
                                            onClick={() => handleDeleteDescription(expIndex, descIndex)}
                                            className="ml-2 text-red-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddDescription(expIndex)}
                                    className="text-blue-600"
                                >
                                    Add Description
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleAddExperience}
                        className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
                    >
                        Add Experience
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExperienceSection;

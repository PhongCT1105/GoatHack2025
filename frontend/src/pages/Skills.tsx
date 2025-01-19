import React from 'react';

interface SkillsProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  expanded: boolean;
  onToggle: () => void;
}

const Skills: React.FC<SkillsProps> = ({
  skills,
  onSkillsChange,
  expanded,
  onToggle
}) => {
  const handleAddSkillDescription = () => {
    onSkillsChange([...skills, '']); // Add an empty string as a new skill description
  };

  const handleChangeSkillDescription = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    onSkillsChange(updatedSkills); // Update the skill at the specific index
  };

  const handleDeleteSkillDescription = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    onSkillsChange(updatedSkills); // Remove the skill at the specific index
  };

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3"
      >
        <span className="font-medium text-gray-700">Skills</span>
        <span
          className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <div className="space-y-3 p-4">
          {skills.map((desc, index) => (
            <div key={index} className="group relative border p-4 rounded-lg">
              {/* Delete Skill Description Button */}
              <button
                onClick={() => handleDeleteSkillDescription(index)}
                className="absolute -top-2 -right-2 text-gray-500 hover:text-red-600 bg-gray-200 rounded-full p-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md transition-all duration-200"
              >
                <span className="text-xs">✕</span>
              </button>

              {/* Description input */}
              <input
                type="text"
                value={desc}
                onChange={(e) => handleChangeSkillDescription(index, e.target.value)}
                placeholder="Description"
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button
            onClick={handleAddSkillDescription}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Skill
          </button>
        </div>
      )}
    </div>
  );
};

export default Skills;

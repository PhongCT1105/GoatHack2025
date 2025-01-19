import React from 'react';

interface EducationType {
    school: string;
    location: string;
    degree: string;
    gpa: string;
    honors: string;
}

interface EducationProps {
    education: EducationType;
    onEducationChange: (field: keyof EducationType, value: string) => void;
    expanded: boolean;
    onToggle: () => void;
}  

const Education: React.FC<EducationProps> = ({
  education,
  onEducationChange,
  expanded,
  onToggle
}) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3"
      >
        <span className="font-medium text-gray-700">Education</span>
        <span className={`transform transition-transform ${expanded ? "rotate-180" : ""}`}>▼</span>
      </button>

      {expanded && (
        <div className="space-y-3 p-4">
          <input
            type="text"
            value={education.school}
            onChange={(e) => onEducationChange('school', e.target.value)}
            placeholder="School Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={education.degree}
            onChange={(e) => onEducationChange('degree', e.target.value)}
            placeholder="Degree"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={education.gpa}
            onChange={(e) => onEducationChange('gpa', e.target.value)}
            placeholder="GPA"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={education.honors}
            onChange={(e) => onEducationChange('honors', e.target.value)}
            placeholder="Honors"
            className="w-full p-2 border rounded"
          />
        </div>
      )}
    </div>
  );
};

export default Education;
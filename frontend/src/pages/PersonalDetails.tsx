import React from 'react';

interface PersonalDetailsType {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

interface PersonalDetailsProps {
  personalDetails: PersonalDetailsType;
  onPersonalDetailsChange: (field: keyof PersonalDetailsType, value: string) => void;
  expanded: boolean;
  onToggle: () => void;
}


const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  personalDetails,
  onPersonalDetailsChange,
  expanded,
  onToggle
}) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3"
      >
        <span className="font-medium text-gray-700">Personal Details</span>
        <span className={`transform transition-transform ${expanded ? "rotate-180" : ""}`}>▼</span>
      </button>

      {expanded && (
        <div className="space-y-3 p-4">
          <input
            type="text"
            value={personalDetails.fullName}
            onChange={(e) => onPersonalDetailsChange('fullName', e.target.value)}
            placeholder="Full Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={personalDetails.phone}
            onChange={(e) => onPersonalDetailsChange('phone', e.target.value)}
            placeholder="Phone"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            value={personalDetails.email}
            onChange={(e) => onPersonalDetailsChange('email', e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={personalDetails.linkedin}
            onChange={(e) => onPersonalDetailsChange('linkedin', e.target.value)}
            placeholder="LinkedIn URL"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={personalDetails.github}
            onChange={(e) => onPersonalDetailsChange('github', e.target.value)}
            placeholder="GitHub URL"
            className="w-full p-2 border rounded"
          />
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;
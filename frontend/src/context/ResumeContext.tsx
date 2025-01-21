// ResumeContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

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

interface ResumeContextType {
  personalDetails: PersonalDetails;
  experiences: Experience[];
  setPersonalDetails: (details: PersonalDetails) => void;
  setExperiences: (experiences: Experience[]) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: 'Phong Cao',
    phone: '7747013932',
    email: 'ptcao@wpi.edu',
    linkedin: 'linkedin.com/in/phong-cao/',
    github: 'github.com/PhongCT1105',
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);

  return (
    <ResumeContext.Provider
      value={{ personalDetails, experiences, setPersonalDetails, setExperiences }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

const useResumeContext = () => {
  const context = React.useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};

export { ResumeProvider, useResumeContext };

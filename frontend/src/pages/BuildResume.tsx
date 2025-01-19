import React, { useState, useEffect } from 'react';
import PersonalDetails from './PersonalDetails';
import Education from './Education';
import ExperienceSection from './Experience';
import Projects from './Projects';
import Skills from './Skills';
import jsPDF from 'jspdf';

interface PersonalDetailsType {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

interface EducationType {
  school: string;
  location: string;
  degree: string;
  gpa: string;
  honors: string;
}

interface ExperienceType {
  company: string;
  role: string;
  duration: string;
  descriptions: string[];
}

interface ProjectType {
  repoName: string;
  date: string;
  descriptions: string[];
}

const BuildResume = () => {
  // States for section expansion
  const [personalExpanded, setPersonalExpanded] = useState(false);
  const [educationExpanded, setEducationExpanded] = useState(false);
  const [experiencesExpanded, setExperiencesExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsType>({
    fullName: "",
    phone: "",
    email: "",
    linkedin: "",
    github: ""
  });

  const [education, setEducation] = useState<EducationType>({
    school: "",
    location: "",
    degree: "",
    gpa: "",
    honors: ""
  });

  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  // Handler functions for state updates
  const handlePersonalDetailsChange = (field: keyof PersonalDetailsType, value: string) => {
    setPersonalDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (field: keyof EducationType, value: string) => {
    setEducation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate PDF function
  const generatePDF = () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) {
      alert("Failed to find resume content.");
      return;
    }

    const doc = new jsPDF();
    const content = resumeElement.innerText || "";
    const margins = 10;
    const lineHeight = 10;
    const lines = content.split("\n");
    let yPosition = margins;

    lines.forEach((line) => {
      if (line.trim() === "") return;

      const isHeadline = line.match(/^[A-Za-z\s]+(:?|(?=\s|$))$/);

      if (isHeadline) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
      }

      if (yPosition + lineHeight > doc.internal.pageSize.getHeight() - margins) {
        doc.addPage();
        yPosition = margins;
      }

      doc.text(line, margins, yPosition);
      yPosition += lineHeight;
    });

    doc.save("resume.pdf");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Input Sections */}
      <div className="w-1/2 p-6 bg-white shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Resume Sections</h2>

        <PersonalDetails
          personalDetails={personalDetails}
          onPersonalDetailsChange={handlePersonalDetailsChange}
          expanded={personalExpanded}
          onToggle={() => setPersonalExpanded(!personalExpanded)}
        />

        <Education
          education={education}
          onEducationChange={handleEducationChange}
          expanded={educationExpanded}
          onToggle={() => setEducationExpanded(!educationExpanded)}
        />

        <ExperienceSection
          experiences={experiences}
          onExperienceChange={setExperiences}
          expanded={experiencesExpanded}
          onToggle={() => setExperiencesExpanded(!experiencesExpanded)}
        />

        <Projects
          projects={projects}
          onProjectsChange={setProjects}
          expanded={projectsExpanded}
          onToggle={() => setProjectsExpanded(!projectsExpanded)}
        />

        <Skills
          skills={skills}
          onSkillsChange={setSkills}
          expanded={skillsExpanded}
          onToggle={() => setSkillsExpanded(!skillsExpanded)}
        />
      </div>

      {/* Right Side - Resume Preview */}
      <div className="w-1/2 p-6 bg-gray-50 shadow-md overflow-y-auto">
        <div id="resume-preview" className="bg-white p-8 shadow rounded">
          {/* Personal Details */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{personalDetails.fullName}</h1>
            <p className="text-sm">
              {personalDetails.email} ∙ {personalDetails.phone} ∙ {personalDetails.linkedin} ∙ {personalDetails.github}
            </p>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Education</h2>
            <p className="font-semibold">{education.school}, {education.location}</p>
            <p>{education.degree}</p>
            <p>GPA: {education.gpa}, {education.honors}</p>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Experience</h2>
            {experiences.map((exp, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{exp.company}</p>
                <p className="italic">{exp.role} | {exp.duration}</p>
                <ul className="list-disc pl-5 mt-1">
                  {exp.descriptions.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Projects</h2>
            {projects.map((project, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{project.repoName}</p>
                <p className="text-sm text-gray-600">{project.date}</p>
                <ul className="list-disc pl-5">
                  {project.descriptions.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Technical Skills</h2>
            <ul className="list-disc pl-5">
              {skills.length > 0 ? (
                skills.map((skill, index) => <li key={index}>{skill}</li>)
              ) : (
                <li>No skills added</li>
              )}
            </ul>
          </div>
        </div>

        <button
          onClick={generatePDF}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default BuildResume;
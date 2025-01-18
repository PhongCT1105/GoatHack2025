import { useState } from 'react';
import { Document, Page } from 'react-pdf'; // react-pdf library for rendering PDF

const BuildResume = () => {
  // State for managing expanded sections
  const [expanded, setExpanded] = useState<string | null>(null);
  const [projects, setProjects] = useState<string[]>(['Project 1', 'Project 2']); // Example data
  const [skills, setSkills] = useState<string[]>(['Skill 1', 'Skill 2']); // Example data

  // Toggle dropdown
  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  // Handle adding a new project (example)
  const addProject = () => {
    setProjects([...projects, `Project ${projects.length + 1}`]);
  };
  // Handle adding a new skill (example)
  const addSkill = () => {
    setSkills([...skills, `Skill ${skills.length + 1}`]);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side: Sections (Form) */}
      <div className="w-1/2 p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Resume Sections</h2>

        {/* Projects Dropdown */}
        <div>
          <button
            onClick={() => toggleSection('projects')}
            className="w-full text-left p-2 bg-gray-200 hover:bg-gray-300 rounded mb-2"
          >
            {expanded === 'projects' ? '▼' : '>'}
            <span className="mr-2"> Projects</span>
          </button>
          {expanded === 'projects' && (
            <div className="ml-4">
              {/* List of Projects */}
              {projects.map((project, index) => (
                <p key={index}>{project}</p>
              ))}
              {/* Button to add new project */}
              <button
                onClick={addProject}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Project
              </button>
            </div>
          )}
        </div>

        {/* Skills Dropdown */}
        <div>
          <button
            onClick={() => toggleSection('skills')}
            className="w-full text-left p-2 bg-gray-200 hover:bg-gray-300 rounded mb-2"
          >
            {expanded === 'skills' ? '▼' : '>'}
            <span className="mr-2"> Skills</span>
          </button>
          {expanded === 'skills' && (
            <div className="ml-4">
              {/* List of Skills */}
              {skills.map((skill, index) => (
                <p key={index}>{skill}</p>
              ))}
              {/* Button to add new skill */}
              <button
                onClick={addSkill}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Skill
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: PDF Preview */}
      <div className="w-1/2 p-6">
        <h2 className="text-xl font-bold mb-4">Preview Resume</h2>

        {/* Use react-pdf to render a sample PDF */}
        <div className="h-full">
          <Document file="/path/to/resume.pdf">
            <Page pageNumber={1} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default BuildResume;

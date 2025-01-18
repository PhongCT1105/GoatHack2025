// Import the BacktraceClient from @backtrace/react with your favorite package manager.
import { BacktraceClient, BacktraceConfiguration } from '@backtrace/react';

// Configure client options
const options: BacktraceConfiguration = {
    // Name of the website/application
    name: 'MyWebPage',
    // Version of the website
    version: '1.2.3',
    // Submission url
    // <universe> is the subdomain of your Backtrace instance (<universe>.backtrace.io)
    // <token> can be found in Project Settings/Submission tokens
    url: 'https://submit.backtrace.io/<universe>/<token>/json',
};

// Initialize the client with the options
const client = BacktraceClient.initialize(options);

// By default, Backtrace will send an error for Uncaught Exceptions and Unhandled Promise Rejections

// Manually send an error
client.send(new Error('Something broke!'));

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";

interface ProjectData {
  repoName: string;
  date: string;
  descriptions: string[];
}

interface PersonalDetails {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

interface Education {
  school: string;
  location: string;
  degree: string;
  gpa: string;
  honors: string;
}

interface Experience {
  company: string;
  role: string;
  duration: string;
  descriptions: string[];
}

const BuildResume = () => {
  // Personal Details State
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: "Phong Cao",
    phone: "774-701-3932",
    email: "ptcao@wpi.edu",
    linkedin: "linkedin.com/in/phong-cao",
    github: "github.com/PhongCT1105"
  });

  // Education State
  const [education, setEducation] = useState<Education>({
    school: "Worcester Polytechnic Institute",
    location: "Worcester, MA",
    degree: "M.S. in Artificial Intelligence, B.S. in Computer Science",
    gpa: "3.95",
    honors: "Dean's List"
  });

  // Experience State
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Projects State (existing)
  const [projects, setProjects] = useState<ProjectData[]>([]);

  // Technical Skills State
  const [skills, setSkills] = useState<string[]>([]);

  // Existing states
  const [githubLink, setGithubLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentDescription, setCurrentDescription] = useState("");
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Section expansion states
  const [personalExpanded, setPersonalExpanded] = useState(false);
  const [educationExpanded, setEducationExpanded] = useState(false);
  const [experiencesExpanded, setExperiencesExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  // Toggle functions for sections
  const togglePersonal = () => setPersonalExpanded(prev => !prev);
  const toggleEducation = () => setEducationExpanded(prev => !prev);
  const toggleExperiences = () => setExperiencesExpanded(prev => !prev);
  const toggleProjects = () => setProjectsExpanded(prev => !prev);
  const toggleSkills = () => setSkillsExpanded(prev => !prev);

  // Add a new description to the skills array
  const handleAddSkillDescription = () => {
    setSkills([...skills, ""]); // Adds an empty description as a new skill
  };

  // Delete a description from the skills array
  const handleDeleteSkillDescription = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  // Handle change in the description input
  const handleChangeSkillDescription = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  // Handle personal details changes
  const handlePersonalDetailsChange = (field: keyof PersonalDetails, value: string) => {
    setPersonalDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle education changes
  const handleEducationChange = (field: keyof Education, value: string) => {
    setEducation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle experience changes
  const handleAddExperience = () => {
    setExperiences(prev => [...prev, {
      company: "",
      role: "",
      duration: "",
      descriptions: [""]
    }]);
  };

  // Other functions
  // Handle description change
  // const handleDescriptionChange = (projectIndex: number, newDescription: string) => {
  //   const updatedProjects = [...projects];
  //   updatedProjects[projectIndex].descriptions = newDescription.split('\n');
  //   setCurrentDescription(newDescription);
  //   setProjects(updatedProjects);
  // };

  // Handle card click to start editing
  const handleCardClick = (index: number) => {
    setEditingIndex(index);
    setCurrentDescription(projects[index].descriptions.join("\n"));
  };

  // Detect clicks outside the card to exit edit mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRefs.current && !cardRefs.current.some(ref => ref && ref.contains(e.target as Node))) {
        setEditingIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle save changes
  const handleSaveChanges = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects[index].descriptions = currentDescription.split("\n");
    setProjects(updatedProjects);
    setEditingIndex(null);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  // Handle add description
  const handleAddExperienceDescription = (experienceIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[experienceIndex].descriptions.push("");
    setExperiences(newExperiences);
  };

  // Handle delete description
  const handleDeleteExperienceDescription = (experienceIndex: number, descriptionIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[experienceIndex].descriptions.splice(descriptionIndex, 1);
    setExperiences(newExperiences);
  };

  // Handle delete experience
  const handleDeleteExperience = (experienceIndex: number) => {
    const newExperiences = experiences.filter((_, index) => index !== experienceIndex);
    setExperiences(newExperiences);
  };

  // Handle delete project
  const handleDeleteProject = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  // Handle GitHub repository submission
  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const urlParts = githubLink.split("/");
      const owner = urlParts[urlParts.length - 2];
      const repo = urlParts[urlParts.length - 1];

      console.log(`Sending data to backend: Owner: ${owner}, Repo: ${repo}`);

      const response = await axios.post("http://localhost:8000/api/github-project", {
        owner,
        repo,
      });

      console.log("Received data from backend:", response.data);

      const updatedProjects = [...projects, response.data];
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));

      setGithubLink("");
    } catch (error) {
      console.error("Error fetching repository data:", error);
      alert("Failed to fetch repository data. Please check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) {
      alert("Failed to find resume content.");
      return;
    }
  
    const doc = new jsPDF();
    const content = resumeElement.innerText || "";
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const margins = 10;
    const textWidth = pageWidth - margins * 2;
    const lineHeight = 10;
    const lines = content.split("\n");
    let yPosition = margins;
  
    lines.forEach((line) => {
      if (line.trim() === "") {
        return;
      }
  
      const isHeadline = line.match(/^[A-Za-z\s]+(:?|(?=\s|$))$/);
  
      if (isHeadline) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
      }
  
      // Split text into chunks that fit within the text width
      const splitLines = doc.splitTextToSize(line, textWidth);
  
      splitLines.forEach((splitLine: any) => {
        if (yPosition + lineHeight > doc.internal.pageSize.getHeight() - margins) {
          doc.addPage();
          yPosition = margins;
        }
  
        doc.text(splitLine, margins, yPosition);
        yPosition += lineHeight;
      });
    });
  
    doc.save("resume.pdf");
  };

  // Load projects from localStorage on component mount
  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Input Sections */}
      <div className="w-1/2 p-6 bg-white shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Resume Sections</h2>

        {/* Personal Details Section */}
        <div className="mb-4">
          <button
            onClick={togglePersonal}
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3"
          >
            <span className="font-medium text-gray-700">Personal Details</span>
            <span className={`transform transition-transform ${personalExpanded ? "rotate-180" : ""}`}>▼</span>
          </button>

          {personalExpanded && (
            <div className="space-y-3 p-4">
              <input
                type="text"
                value={personalDetails.fullName}
                onChange={(e) => handlePersonalDetailsChange('fullName', e.target.value)}
                placeholder="Full Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={personalDetails.phone}
                onChange={(e) => handlePersonalDetailsChange('phone', e.target.value)}
                placeholder="Phone"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                value={personalDetails.email}
                onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={personalDetails.linkedin}
                onChange={(e) => handlePersonalDetailsChange('linkedin', e.target.value)}
                placeholder="LinkedIn URL"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={personalDetails.github}
                onChange={(e) => handlePersonalDetailsChange('github', e.target.value)}
                placeholder="GitHub URL"
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="mb-4">
          <button
            onClick={toggleEducation}
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3"
          >
            <span className="font-medium text-gray-700">Education</span>
            <span className={`transform transition-transform ${educationExpanded ? "rotate-180" : ""}`}>▼</span>
          </button>

          {educationExpanded && (
            <div className="space-y-3 p-4">
              <input
                type="text"
                value={education.school}
                onChange={(e) => handleEducationChange('school', e.target.value)}
                placeholder="School Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={education.location}
                onChange={(e) => handleEducationChange('location', e.target.value)}
                placeholder="Location"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={education.degree}
                onChange={(e) => handleEducationChange('degree', e.target.value)}
                placeholder="Degree"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={education.gpa}
                onChange={(e) => handleEducationChange('gpa', e.target.value)}
                placeholder="GPA"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={education.honors}
                onChange={(e) => handleEducationChange('honors', e.target.value)}
                placeholder="Honors"
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="mb-4">
          <button
            onClick={toggleExperiences}
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3"
          >
            <span className="font-medium text-gray-700">Experience</span>
            <span className={`transform transition-transform ${experiencesExpanded ? "rotate-180" : ""}`}>▼</span>
          </button>

          {experiencesExpanded && (
            <div className="space-y-3 p-4">
              {experiences.map((exp, expIndex) => (
                <div key={expIndex} className="group relative border p-4 rounded-lg">
                  {/* Delete Experience Button */}
                  <button
                    onClick={() => handleDeleteExperience(expIndex)}
                    className="absolute -top-2 -right-2 text-gray-500 hover:text-red-600 bg-gray-200 rounded-full p-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md transition-all duration-200"
                  >
                    <span className="text-xs">✕</span>
                  </button>

                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExperiences = [...experiences];
                      newExperiences[expIndex].company = e.target.value;
                      setExperiences(newExperiences);
                    }}
                    placeholder="Company Name"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const newExperiences = [...experiences];
                      newExperiences[expIndex].role = e.target.value;
                      setExperiences(newExperiences);
                    }}
                    placeholder="Role"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => {
                      const newExperiences = [...experiences];
                      newExperiences[expIndex].duration = e.target.value;
                      setExperiences(newExperiences);
                    }}
                    placeholder="Duration"
                    className="w-full p-2 border rounded mb-2"
                  />

                  {/* Descriptions Section */}
                  <div className="space-y-2">
                    {exp.descriptions.map((desc, descIndex) => (
                      <div key={descIndex} className="group/desc relative flex items-center gap-2">
                        <input
                          type="text"
                          value={desc}
                          onChange={(e) => {
                            const newExperiences = [...experiences];
                            newExperiences[expIndex].descriptions[descIndex] = e.target.value;
                            setExperiences(newExperiences);
                          }}
                          placeholder="Description"
                          className="w-full p-2 border rounded"
                        />
                        <button
                          onClick={() => handleDeleteExperienceDescription(expIndex, descIndex)}
                          className="opacity-0 group-hover/desc:opacity-100 text-gray-500 hover:text-red-600 transition-opacity duration-200"
                        >
                          <span className="text-xl">×</span>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddExperienceDescription(expIndex)}
                      className="w-full p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors mt-2"
                    >
                      + Add Description
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddExperience}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Experience
              </button>
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div>
          <button
            onClick={toggleProjects}
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3 mt-3 transition-all duration-300"
          >
            <span className="font-medium text-gray-700">Projects</span>
            <span
              className={`transform transition-transform duration-300 ${projectsExpanded ? "rotate-180" : "rotate-0"
                }`}
            >
              ▼
            </span>
          </button>

          {projectsExpanded && (
            <div className="w-full">
              {/* GitHub Input Form */}
              <form onSubmit={handleGithubSubmit} className="flex items-center">
                <input
                  type="text"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="GitHub repository URL"
                  className="flex-grow p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-2 w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 transition-all"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a1 1 0 011-1h4V4a1 1 0 112 0v5h4a1 1 0 110 2h-4v5a1 1 0 11-2 0v-5H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </form>

              {/* List of Projects */}
              {projects.map((project, index) => (
                <div
                  key={index}
                  ref={(el) => cardRefs.current[index] = el}
                  className={`group relative mb-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all mt-4 ${editingIndex === index ? "min-h-[280px] pb-10" : "min-h-[120px]"
                    }`}
                  onClick={() => handleCardClick(index)}
                >
                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(index);
                    }}
                    className="absolute -top-2 -right-2 text-gray-500 hover:text-red-600 bg-gray-200 rounded-full p-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md transition-all duration-200"
                  >
                    <span className="text-xs">✕</span>
                  </button>

                  <h3 className="font-semibold text-lg">{project.repoName}</h3>
                  <p className="text-xs text-gray-500">{project.date}</p>

                  <div className="mt-2">
                    {editingIndex === index ? (
                      <div className="space-y-4">
                        <textarea
                          value={currentDescription}
                          onChange={(e) => setCurrentDescription(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          rows={7}
                        />
                      </div>
                    ) : (
                      <ul className="list-disc pl-5 space-y-1 overflow-y-auto max-h-[300px]">
                        {project.descriptions.map((desc, descIndex) => (
                          <li key={descIndex} className="text-sm text-gray-700">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {editingIndex === index && (
                    <div className="absolute bottom-2.25 right-4 flex justify-end">
                      <button
                        onClick={() => handleSaveChanges(index)}
                        className="bg-blue-500 text-white rounded-xl px-4 py-1 hover:bg-blue-600 transition-all"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills Descriptions Section */}
        <div className="mb-4">
          <button
            onClick={toggleSkills}
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3"
          >
            <span className="font-medium text-gray-700">Skills</span>
            <span
              className={`transform transition-transform ${skillsExpanded ? "rotate-180" : ""
                }`}
            >
              ▼
            </span>
          </button>

          {skillsExpanded && (
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


      </div>

      {/* Right Side - Resume Preview */}
      <div className="w-1/2 p-6 bg-gray-50 shadow-md overflow-y-auto">
        <div id="resume-preview" className="bg-white p-8 shadow rounded">
          {/* Personal Details */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{personalDetails.fullName}</h1>
            <p className="text-sm">
              {personalDetails.email} - {personalDetails.phone} - {personalDetails.linkedin} - {personalDetails.github}
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
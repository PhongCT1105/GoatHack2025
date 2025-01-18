import { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";

interface ProjectData {
  repoName: string;
  date: string;
  descriptions: string[];
}

const BuildResume = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [githubLink, setGithubLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [education, setEducation] = useState("")
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentDescription, setCurrentDescription] = useState("");
  const cardRefs = useRef([]);
  const [experiencesExpanded, setExperiencesExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [educationExpanded, setEducationExpanded] = useState(false);

  // Each section gets its own toggle function
  const toggleExperiences = () => setExperiencesExpanded(prev => !prev);
  const toggleProjects = () => setProjectsExpanded(prev => !prev);
  const toggleEducation = () => setEducationExpanded(prev => !prev);

  const handleDescriptionChange = (projectIndex, newDescription) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].descriptions = newDescription;
    setCurrentDescription(newDescription);
    setProjects(updatedProjects);
  };

  // Handle card click to start editing
  const handleCardClick = (index) => {
    setEditingIndex(index); // Set the clicked card as the editing one
    setCurrentDescription(projects[index].descriptions.join("\n"));
  };

  // Detect clicks outside the card to exit edit mode
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRefs.current && !cardRefs.current.some(ref => ref && ref.contains(e.target))) {
        setEditingIndex(null); // Exit edit mode if click is outside
      }
    };

    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle save changes
  const handleSaveChanges = (index) => {
    const updatedProjects = [...projects];
    updatedProjects[index].descriptions = currentDescription.split("\n");
    setProjects(updatedProjects);
    setEditingIndex(null); // Exit edit mode after saving
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  // Handle delete project
  const handleDeleteProject = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1); // Remove the project from the array
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

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
      localStorage.setItem("projects", JSON.stringify(updatedProjects)); // Save to localStorage

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
    const content = resumeElement.innerText || ""; // Extract plain text from the element

    const pageWidth = doc.internal.pageSize.getWidth();
    const margins = 10;
    const lineHeight = 10;
    const textWidth = pageWidth - margins * 2;

    const lines = content.split("\n"); // Split content into individual lines
    let yPosition = margins;

    lines.forEach((line) => {
      if (line.trim() === "") {
        return;
      }

      // Check for headline-like lines
      const isHeadline = line.match(/^[A-Za-z\s]+(:?|(?=\s|$))$/); // Matches lines that are titles or headings

      if (isHeadline) {
        doc.setFont("helvetica", "bold"); // Bold font for headlines
        doc.setFontSize(14); // Larger font size
      } else {
        doc.setFont("helvetica", "normal"); // Normal font for regular text
        doc.setFontSize(10); // Smaller font size
      }

      // If the text doesn't fit on the current page, create a new page
      if (yPosition + lineHeight > doc.internal.pageSize.getHeight() - margins) {
        doc.addPage();
        yPosition = margins;
      }

      // Add the line to the PDF
      doc.text(line, margins, yPosition);
      yPosition += lineHeight;
    });

    doc.save("resume.pdf");
  };

  // Retrieve projects from localStorage on component mount
  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects)); // Set the stored projects
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Project Input */}
      <div className="w-1/2 p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Resume Sections</h2>

        <div>
          <button
            onClick={toggleExperiences}
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3 transition-all duration-300"
          >
            <span className="font-medium text-gray-700">Experiences</span>
            <span
              className={`transform transition-transform duration-300 ${experiencesExpanded ? "rotate-180" : "rotate-0"
                }`}
            >
              ▼
            </span>
          </button>

          {experiencesExpanded && (
            <div className="w-full">
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
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all mt-4"
                >
                  <h3 className="font-semibold text-lg">{project.repoName}</h3>
                  <p className="text-xs text-gray-500">{project.date}</p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {project.descriptions.map((desc, descIndex) => (
                      <li key={descIndex} className="text-sm text-gray-700">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
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
      </div>

      {/* Right Side - Live Resume Preview */}
      <div className="w-1/2 p-6 bg-gray-50 shadow-md">
        <div id="resume-preview" className="bg-white p-4 shadow rounded">
          <div contentEditable suppressContentEditableWarning className="mb-6">
            <h1 className="text-2xl font-bold">Phong Cao</h1>
            <p className="text-sm">
              ptcao@wpi.edu ∙ 774-701-3932 ∙ linkedin.com/in/phong-cao ∙
              github.com/PhongCT1105
            </p>
          </div>

          <div contentEditable suppressContentEditableWarning className="mb-6">
            <h2 className="text-lg font-bold">Education</h2>
            <p>Worcester Polytechnic Institute, Worcester, MA</p>
            <p>M.S. in Artificial Intelligence, B.S. in Computer Science</p>
            <p>GPA: 3.95, Dean’s List</p>
          </div>

          <div contentEditable suppressContentEditableWarning className="mb-6">
            <h2 className="text-lg font-bold">Skills</h2>
            <ul className="list-disc pl-5">
              <li>
                Programming Languages: Python, C, C++, TypeScript, JavaScript,
                Java, SQL
              </li>
              <li>
                AI/ML Frameworks: Scikit-learn, PyTorch, TensorFlow, LangChain
              </li>
              <li>Web Development: React.js, Next.js, Express, Node.js</li>
              <li>DevOps: Docker, Linux, GitHub, Azure DevOps</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold">Projects</h2>
            {projects.map((project, index) => (
              <div
                key={index}
                contentEditable
                suppressContentEditableWarning
                className="mb-4"
              >
                <h3 className="font-bold">{project.repoName}</h3>
                <p className="text-sm text-gray-600">{project.date}</p>
                <ul className="list-disc pl-5">
                  {project.descriptions.map((desc, descIndex) => (
                    <li key={descIndex}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
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
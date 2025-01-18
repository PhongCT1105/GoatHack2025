import { useState } from "react";
import axios from "axios";

interface ProjectData {
  repoName: string;
  date: string;
  descriptions: string[];
}

const BuildResume = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [githubLink, setGithubLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [eduaction, setEducation] = useState("")
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState('');

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const urlParts = githubLink.split("/");
      const owner = urlParts[urlParts.length - 2];
      const repo = urlParts[urlParts.length - 1];

      console.log(`Sending data to backend: Owner: ${owner}, Repo: ${repo}`);

      // Make API call to your backend
      const response = await axios.post("http://localhost:8000/api/github-project", {
        owner,
        repo,
      });

      console.log("Received data from backend:", response.data);

      // Add the new project data to the projects array
      setProjects([...projects, response.data]);
      setGithubLink(""); // Clear the input field
    } catch (error) {
      console.error("Error fetching repository data:", error);
      alert("Failed to fetch repository data. Please check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Project Input */}
      <div className="w-1/2 p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Resume Sections</h2>

        {/* Projects Dropdown */}
        <div>
          <button
            onClick={() => toggleSection("projects")}
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3 transition-all duration-300"
          >
            <span className="font-medium text-gray-700">Projects</span>
            <span
              className={`transform transition-transform duration-300 ${expanded === "projects" ? "rotate-180" : "rotate-0"
                }`}
            >
              ▼
            </span>
          </button>

          {expanded === "projects" && (
            <div className="ml-4">
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
                  className="ml-2 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 transition-all"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
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
                  className="mb-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
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

      </div>

      {/* Right Side - Live Resume Preview */}
      <div className="w-1/2 p-6 bg-gray-50 shadow-md">
        <div className="bg-white p-4 shadow rounded">
          {/* Contact Info */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="mb-6"
          >
            <h1 className="text-2xl font-bold">Phong Cao</h1>
            <p className="text-sm">
              ptcao@wpi.edu ∙ 774-701-3932 ∙ linkedin.com/in/phong-cao ∙
              github.com/PhongCT1105
            </p>
          </div>

          {/* Education */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="mb-6"
          >
            <h2 className="text-lg font-bold">Education</h2>
            <p>Worcester Polytechnic Institute, Worcester, MA</p>
            <p>M.S. in Artificial Intelligence, B.S. in Computer Science</p>
            <p>GPA: 3.95, Dean’s List</p>
          </div>

          {/* Skills */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="mb-6"
          >
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

          {/* Projects */}
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
      </div>
    </div>
  );
};

export default BuildResume;

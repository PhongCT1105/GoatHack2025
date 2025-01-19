import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

interface Project {
  repoName: string;
  date: string;
  descriptions: string[];
}

interface ProjectsProps {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
  expanded: boolean;
  onToggle: () => void;
}

const Projects: React.FC<ProjectsProps> = ({
  projects,
  onProjectsChange,
  expanded,
  onToggle,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentDescription, setCurrentDescription] = useState<string>('');
  const [githubLink, setGithubLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch the project data from the backend on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
        const fetchedProjects = response.data;
        onProjectsChange(fetchedProjects); // Update parent state with fetched data
      } catch (error) {
        console.error('Error fetching project data:', error);
        alert('Failed to load project data.');
      }
    };

    fetchProjects();
  }, [onProjectsChange]);

  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const urlParts = githubLink.split('/');
      const owner = urlParts[urlParts.length - 2];
      const repo = urlParts[urlParts.length - 1];

      console.log(`Sending data to backend: Owner: ${owner}, Repo: ${repo}`);

      const response = await axios.post('http://localhost:8000/api/github-project', {
        owner,
        repo,
      });

      console.log('Received data from backend:', response.data);

      const updatedProjects = [...projects, response.data];
      onProjectsChange(updatedProjects); // Update parent state with new project data
      localStorage.setItem('projects', JSON.stringify(updatedProjects));

      setGithubLink('');
    } catch (error) {
      console.error('Error fetching repository data:', error);
      alert('Failed to fetch repository data. Please check the URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (index: number) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  const handleSaveChanges = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects[index].descriptions.push(currentDescription);
    onProjectsChange(updatedProjects);
    setEditingIndex(null);
    setCurrentDescription('');
  };

  const handleDeleteProject = (index: number) => {
    const updatedProjects = projects.filter((_, idx) => idx !== index);
    onProjectsChange(updatedProjects);
  };

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md mb-3 mt-3 transition-all duration-300"
      >
        <span className="font-medium text-gray-700">Projects</span>
        <span
          className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-0'}`}
        >
          ▼
        </span>
      </button>

      {expanded && (
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
              ref={(el) => (cardRefs.current[index] = el)}
              className={`group relative mb-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all mt-4 ${
                editingIndex === index
                  ? 'min-h-[280px] pb-10'
                  : 'min-h-[120px]'
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
  );
};

export default Projects;

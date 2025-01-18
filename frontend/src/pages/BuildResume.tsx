import { useState } from 'react';
import axios from 'axios';

interface ProjectData {
  repoName: string;
  date: string;
  descriptions: string[];
}

const BuildResume = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [githubLink, setGithubLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Extract owner and repo from GitHub URL
      const urlParts = githubLink.split('/');
      const owner = urlParts[urlParts.length - 2];
      const repo = urlParts[urlParts.length - 1];

      console.log(`Sending data to backend: Owner: ${owner}, Repo: ${repo}`);

      // Make API call to your backend
      const response = await axios.post('http://localhost:8000/api/github-project', {
        owner,
        repo,
      });

      console.log('Received data from backend:', response.data);

      // Add the new project data to the projects array
      setProjects([...projects, response.data]);
      setGithubLink(''); // Clear the input field
    } catch (error) {
      console.error('Error fetching repository data:', error);
      alert('Failed to fetch repository data. Please check the URL.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
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
              {/* GitHub Input Form */}
              <form onSubmit={handleGithubSubmit} className="mb-4">
                <input
                  type="text"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="Enter GitHub repository URL"
                  className="w-full p-2 border rounded mb-2"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {isLoading ? 'Loading...' : 'Add Project'}
                </button>
              </form>

              {/* List of Projects */}
              {projects.map((project, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <h3 className="font-bold">{project.repoName}</h3>
                  <p className="text-sm text-gray-600">{project.date}</p>
                  <ul className="mt-2 list-disc pl-5">
                    {project.descriptions.map((desc, descIndex) => (
                      <li key={descIndex} className="text-sm">
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

      {/* Right Side: PDF Preview */}
      <div className="w-1/2 p-6">
        <h2 className="text-xl font-bold mb-4">Preview Resume</h2>
        <div className="h-full">
          pdf supposed to be here
        </div>
      </div>
    </div>
  );
};

export default BuildResume;

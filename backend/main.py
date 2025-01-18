from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
import logging
from Fetch import aggregate_repo_data  # Import aggregate_repo_data from Fetch.py
from model import generate_star_resume_section  # Import generate_star_resume_section from Model.py

# Setup logging
logging.basicConfig(level=logging.INFO)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GitHubRepo(BaseModel):
    owner: str
    repo: str

@app.post("/api/github-project")
async def get_github_project(repo_data: GitHubRepo):
    try:
        # Fetch GitHub data using aggregate_repo_data
        logging.info(f"Fetching data for owner: {repo_data.owner}, repo: {repo_data.repo}")
        repo_details = aggregate_repo_data(repo_data.owner, repo_data.repo)
        
        if not repo_details:
            logging.error(f"Repository not found: {repo_data.owner}/{repo_data.repo}")
            raise HTTPException(status_code=404, detail="Repository not found")
        
        # Generate the STAR-based resume section
        star_resume = generate_star_resume_section(repo_details)
        
        if not star_resume:
            logging.error("Error generating STAR resume section.")
            raise HTTPException(status_code=500, detail="Failed to generate resume section")
        
        # Return the structured data for the frontend
        return {
            "repoName": star_resume["Name"],
            "date": star_resume["Date"],
            "descriptions": star_resume["Descriptions"]
        }

    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


# Test that the API is working
@app.get("/")
async def root():
    return {"message": "Hello World"}

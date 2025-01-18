from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
from Fetch.Fetch import aggregate_repo_data
import logging

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
        # Use the existing aggregate_repo_data function
        logging.info(f"Fetching data for owner: {repo_data.owner}, repo: {repo_data.repo}")
        result = aggregate_repo_data(repo_data.owner, repo_data.repo)
        
        if not result:
            logging.error(f"Repository not found: {repo_data.owner}/{repo_data.repo}")
            raise HTTPException(status_code=404, detail="Repository not found")
        
        # Log the result to verify data structure
        logging.info(f"Fetched data: {result}")
        
        # Save to file
        with open("repo_data.json", "w") as file:
            json.dump(result, file, indent=4)
        
        # Return only the necessary data for the frontend
        return {
            "repoName": result.get("Repository Name", "N/A"),
            "description": result.get("Description", "No description available"),
            "languages": result.get("Languages", {}),
            "topics": result.get("Topics", [])
        }
    except Exception as e:
        logging.error(f"Error fetching repository data: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Test that the API is working
@app.get("/")
async def root():
    return {"message": "Hello World"}

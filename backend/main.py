from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from pinecone import Pinecone
from dotenv import load_dotenv
import json
import logging
from Fetch import aggregate_repo_data  # Import aggregate_repo_data from Fetch.py
from model import generate_star_resume_section  # Import generate_star_resume_section from Model.py
from cvmodel import generate_cover_letter  # Import the AI function from cvmodel.py
from querydb import search_pinecone

# Load environment variables
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
index_name = "vecdb"
index = pc.Index(index_name)

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
        print(f"Received request for owner: {repo_data.owner}, repo: {repo_data.repo}")
        logging.info(f"Fetching data for owner: {repo_data.owner}, repo: {repo_data.repo}")
        
        # Fetch GitHub data using aggregate_repo_data
        repo_details = aggregate_repo_data(repo_data.owner, repo_data.repo)
        
        # Debugging: Print fetched repo details
        print(f"Fetched repo details: {repo_details}")
        
        if not repo_details:
            logging.error(f"Repository not found: {repo_data.owner}/{repo_data.repo}")
            raise HTTPException(status_code=404, detail="Repository not found")
        
        # Generate the STAR-based resume section
        star_resume = generate_star_resume_section(repo_details)
        
        # Debugging: Print generated STAR resume
        print(f"Generated STAR resume section: {star_resume}")
        
        if not star_resume:
            logging.error("Error generating STAR resume section.")
            raise HTTPException(status_code=500, detail="Failed to generate resume section")
        
        # Return the structured data for the frontend
        result = {
            "repoName": star_resume["Name"],
            "date": star_resume["Date"],
            "descriptions": star_resume["Descriptions"]
        }
        
        # Debugging: Print final response
        print(f"Returning response: {result}")
        return result

    except Exception as e:
        # Debugging: Print the exception details
        print(f"Exception occurred: {str(e)}")
        logging.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

class CoverLetterRequest(BaseModel):
    fullName: str
    jobTitle: str
    companyName: str
    jobDescription: str
    skills: list
    
class CoverLetterRequest(BaseModel):
    fullName: str
    jobTitle: str
    companyName: str
    jobDescription: str
    skills: list

@app.post("/api/generate-cover-letter")
async def generate_cover_letter_endpoint(request: CoverLetterRequest):
    try:
        logging.info(f"Received cover letter request for: {request.fullName}")

        # Generate cover letter
        cover_letter = generate_cover_letter(
            request.fullName,
            request.jobTitle,
            request.companyName,
            request.jobDescription,
            request.skills
        )

        if not cover_letter:
            logging.error("Failed to generate cover letter.")
            raise HTTPException(status_code=500, detail="Failed to generate cover letter")

        logging.info("Cover letter generated successfully.")
        return {"coverLetter": cover_letter}

    except Exception as e:
        logging.error(f"Error processing cover letter request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

class QueryRequest(BaseModel):
    query: str

@app.post("/api/search")
async def search_jobs(request: QueryRequest):
    """
    Endpoint to handle job search queries.
    """
    try:
        results = search_pinecone(query=request.query, namespace="ns1", top_k=10)
        return {"similarJobs": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Test that the API is working
@app.get("/")
async def root():
    print("Root endpoint accessed.")
    return {"message": "Hello World"}

import os
from openai import OpenAI
from dotenv import load_dotenv
import json
from Fetch import aggregate_repo_data

# Load environment variables
load_dotenv()

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(
    api_key=OPENAI_API_KEY,
)

def generate_star_resume_section(repo_data):
    """
    Generate a STAR-based project section for a resume using OpenAI API.
    :param repo_data: Dictionary containing GitHub repository details.
    :return: A dictionary with Name, Date, and Descriptions.
    """
    try:
        # Prepare the prompt with the repo data
        prompt = f"""
        Create a project section for a resume using the STAR (Situation, Task, Action, Result) method. 
        Each component should be a concise bullet point of 1-2 sentences.

        Repository Details:
        Repository Name: {repo_data['Repository Name']}
        Description: {repo_data['Description']}
        Topics: {', '.join(repo_data.get('Topics', []))}
        Languages: {json.dumps(repo_data['Languages'], indent=2)}
        Recent Commit Messages: {', '.join(repo_data['Recent Commit Messages'][:5])}  # First 5 commit messages

        Generate a professional and concise project section.
        """

        # Call OpenAI API to generate completion
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional resume builder"},
                {"role": "user", "content": prompt},
            ]
        )

        # Parse the result into a list of descriptions
        result_text = completion.choices[0].message.content.strip()
        descriptions = result_text.split("\n")
        descriptions = [desc.strip("- ") for desc in descriptions if desc.startswith("-")]

        # Return the structured data
        return {
            "Name": repo_data["Repository Name"],
            "Date": f"{repo_data['Start Date']} - {repo_data['Last Updated']}",
            "Descriptions": descriptions[:4]  # Limit to 4 descriptions
        }

    except Exception as e:
        print(f"Error generating resume section: {e}")
        return None



if __name__ == "__main__":
    
    # Define GitHub repository details
    owner = "PhongCT1105"
    repo = "Personal_Portfolio"

    # Fetch repository data dynamically using Fetch.py
    repo_data = aggregate_repo_data(owner, repo, commit_limit=100)

    if repo_data:
        # Generate STAR-based resume section
        star_section = generate_star_resume_section(repo_data)

        # Print the result
        print("Generated STAR Resume Section:")
        print(star_section)
    else:
        print("Failed to fetch repository data.")

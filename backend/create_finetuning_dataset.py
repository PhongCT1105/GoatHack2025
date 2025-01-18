import os
import json
from dotenv import load_dotenv
from Fetch import aggregate_repo_data
from model import generate_star_resume_section

# Load environment variables
load_dotenv()

# GitHub and OpenAI tokens
github_token = os.getenv("GITHUB_TOKEN")

# Example repositories for fine-tuning data
REPOSITORIES = [
    {"owner": "PhongCT1105", "repo": "SyntheSearch"},
    {"owner": "giahienhoang99", "repo": "realtime_chat_app"},
    {"owner": "PhongCT1105", "repo": "Personal_Portfolio"},
    {"owner": "PhongCT1105", "repo": "S-P_500_Stock_Prediction"}
]

def create_finetuning_data(repos, output_file="finetuning_data.jsonl"):
    """
    Create fine-tuning dataset by fetching repository details and generating STAR-based resume sections.
    
    :param repos: List of repositories with 'owner' and 'repo' keys.
    :param output_file: File to save the fine-tuning dataset in JSONL format.
    """
    fine_tuning_data = []

    for repo in repos:
        owner = repo["owner"]
        repo_name = repo["repo"]
        print(f"Processing repository: {owner}/{repo_name}...")
        
        # Fetch repository data
        repo_data = aggregate_repo_data(owner, repo_name)
        if not repo_data:
            print(f"Failed to fetch data for {owner}/{repo_name}. Skipping.")
            continue
        
        # Generate STAR-based resume section
        star_section = generate_star_resume_section(repo_data)
        if not star_section:
            print(f"Failed to generate STAR section for {owner}/{repo_name}. Skipping.")
            continue
        
        # Format data for fine-tuning
        prompt = f"""
        Create a project section for a resume using the STAR (Situation, Task, Action, Result) method.
        Repository Details:
        Repository Name: {repo_data['Repository Name']}
        Description: {repo_data['Description']}
        Topics: {', '.join(repo_data.get('Topics', []))}
        Languages: {json.dumps(repo_data['Languages'], indent=2)}
        Recent Commit Messages: {', '.join(repo_data['Recent Commit Messages'][:5])}
        """
        completion = "\n".join([
            f"- {desc}" for desc in star_section["Descriptions"]
        ])
        
        fine_tuning_data.append({
            "prompt": prompt.strip(),
            "completion": completion.strip()
        })
    
    # Save the dataset to a JSONL file
    with open(output_file, "w") as file:
        for entry in fine_tuning_data:
            file.write(json.dumps(entry) + "\n")
    
    print(f"Fine-tuning dataset saved to {output_file}.")

if __name__ == "__main__":
    create_finetuning_data(REPOSITORIES)

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
    {"owner": "PhongCT1105", "repo": "S-P_500_Stock_Prediction"},
    {"owner": "PhongCT1105", "repo": "SyntheSearch"},
    {"owner": "giahienhoang99", "repo": "realtime_chat_app"},
    {"owner": "PhongCT1105", "repo": "Personal_Portfolio"},
    {"owner": "wolflieu201105", "repo": "boardGameRecreation"},
    {"owner": "MaVeryo", "repo": "amap_sase_hack_2024"},
    {"owner": "wolflieu201105", "repo": "nextgenproject"},
    {"owner": "pemistahl", "repo": "lingua-py"},
    {"owner": "pemistahl", "repo": "grex"},
    {"owner": "PhongCT1105", "repo": "S-P_500_Stock_Prediction"},
    {"owner": "PhongCT1105", "repo": "Web-application-for-Mass-General-Brigham-Hospital"},
    {"owner": "doanh280605", "repo": "Lottery"},
    {"owner": "doanh280605", "repo": "FullStackApp"},
    {"owner": "giahienhoang99", "repo": "realtime_chat_app"},
    {"owner": "giahienhoang99", "repo": "portfolio"},
    {"owner": "giahienhoang99", "repo": "BrighamWomenHospitalMap"},
    {"owner": "FelixNgFender", "repo": "ARFlow"},
    {"owner": "FelixNgFender", "repo": "Mu2Mi"},
    {"owner": "FelixNgFender", "repo": "yammers"},
    {"owner": "FelixNgFender", "repo": "aws-cdk"},
    {"owner": "openai", "repo": "openai-cookbook"},
    {"owner": "juliangarnier", "repo": "3D-Hartwig-chess-set"},
    {"owner": "kenrick95", "repo": "c4"},
    {"owner": "softvar", "repo": "save-the-forest"},
    {"owner": "demonixis", "repo": "Maze3D"},
    {"owner": "50ap5ud5", "repo": "TardisRefined"},
    {"owner": "hetsuthar028", "repo": "restaurant-app-wt"},
    {"owner": "PokeAPI", "repo": "sprites"},
    {"owner": "PaulTR", "repo": "AndroidDemoProjects"},
    {"owner": "brocode", "repo": "docker-service-rpm"},
    {"owner": "serverless", "repo": "serverless"},
    {"owner": "Chalarangelo", "repo": "30-seconds-of-code"},
    {"owner": "abhayma1000", "repo": "snake-ai-pytorch"},
    {"owner": "abhayma1000", "repo": "WordleBot"},
    {"owner": "abhayma1000", "repo": "Rockets"},
    {"owner": "1chooo", "repo": "1chooo.com"},
    {"owner": "1chooo", "repo": "thermal-calculator"},
    {"owner": "smogon", "repo": "pokemon-showdown"},
    {"owner": "simeydotme", "repo": "pokemon-cards-css"},
    {"owner": "webbukkit", "repo": "dynmap"},
    {"owner": "cabaletta", "repo": "baritone"},
    {"owner": "SeakMengs", "repo": "WindowPet"},
    {"owner": "tonybaloney", "repo": "vscode-pets"}
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

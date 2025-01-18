import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(
    api_key=OPENAI_API_KEY,
)

def load_repo_data(file_path):
    """
    Load GitHub repository data from a JSON file.
    :param file_path: Path to the JSON file containing repository data.
    :return: Loaded JSON data as a dictionary.
    """
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading repository data: {e}")
        return None

def generate_star_resume_section(repo_data):
    """
    Generate a STAR-based project section for a resume using OpenAI API.
    :param repo_data: Dictionary containing GitHub repository details.
    :return: Generated resume section as a string.
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
        Stars: {repo_data['Stars']}
        Forks: {repo_data['Forks']}
        Languages: {json.dumps(repo_data['Languages'], indent=2)}
        Recent Commit Messages: {', '.join(repo_data['Recent Commit Messages'])}

        Generate a professional and concise project section.
        """

        # Call OpenAI API to generate completion
        completion = client.chat.completions.create(
            model="gpt-4",  # Using GPT-4
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ]
        )

        # Return the generated content
        return completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"Error generating resume section: {e}")
        return None


if __name__ == "__main__":
    # Load repository data from JSON file
    repo_data_path = "../Fetch/repo_data.json"  # Path to the JSON file
    repo_data = load_repo_data(repo_data_path)

    if repo_data:
        # Generate STAR-based resume section
        star_section = generate_star_resume_section(repo_data)

        # Print the result
        print("Generated STAR Resume Section:")
        print(star_section)
    else:
        print("Failed to load repository data.")

import requests
import json
import base64
from dotenv import load_dotenv
import os

load_dotenv()

github_token = os.getenv("GITHUB_TOKEN")

def fetch_repo_info(owner, repo):
    """
    Fetch basic repository information including topics and description.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}"
    headers = {"Authorization": f"token {github_token}"}
    # response = requests.get(url, headers=headers)
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return {
            "name": data.get("name"),
            "description": data.get("description", "No description available."),
            "topics": data.get("topics", []),
            "created_at": data.get("created_at"),
            "pushed_at": data.get("pushed_at"),
        }
    print(f"Error fetching repo info for {owner}/{repo}: {response.status_code}")
    return None

def fetch_repo_files(owner, repo, path=""):
    """
    Recursively fetch all file names in the repository.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    headers = {"Authorization": f"token {github_token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        items = response.json()
        file_list = []
        for item in items:
            if item["type"] == "file":
                file_list.append(item["path"])
            elif item["type"] == "dir":
                file_list.extend(fetch_repo_files(owner, repo, item["path"]))
        return file_list
    print(f"Error fetching files for {owner}/{repo} at path '{path}': {response.status_code}")
    return []

def fetch_repo_languages(owner, repo):
    """
    Fetch programming languages used in the repository and their percentages.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/languages"
    headers = {"Authorization": f"token {github_token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        total_bytes = sum(data.values())
        return {lang: round((bytes / total_bytes) * 100, 2) for lang, bytes in data.items()}
    print(f"Error fetching languages for {owner}/{repo}: {response.status_code}")
    return {}

def fetch_readme(owner, repo):
    """
    Fetch and decode the README file content if available.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/README.md"
    headers = {"Authorization": f"token {github_token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        readme_data = response.json()
        return base64.b64decode(readme_data["content"]).decode("utf-8")
    print(f"README not found for {owner}/{repo}: {response.status_code}")
    return "No README available."

def fetch_commit_messages(owner, repo, limit=100):
    """
    Fetch recent commit messages (up to the specified limit).
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/commits"
    headers = {"Authorization": f"token {github_token}"}
    params = {"per_page": min(limit, 100)}  # GitHub API max is 100 per page
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        commits = response.json()
        return [commit["commit"]["message"] for commit in commits]
    print(f"Error fetching commits for {owner}/{repo}: {response.status_code}")
    return []

def aggregate_repo_data(owner, repo, commit_limit=100):
    """
    Aggregate all metadata for a repository, including commit messages and basic information.
    """
    repo_info = fetch_repo_info(owner, repo) or {}
    repo_languages = fetch_repo_languages(owner, repo) or {}
    readme_content = fetch_readme(owner, repo) or "No README available."
    all_files = fetch_repo_files(owner, repo) or []
    recent_commit_messages = fetch_commit_messages(owner, repo, limit=commit_limit) or []

    if not repo_info.get("name"):
        print(f"Repository {owner}/{repo} has missing 'name'. Skipping.")
        return None

    return {
        "Repository Name": repo_info.get("name", "Unknown Repository"),
        "Description": repo_info.get("description", "No description available."),
        "Topics": repo_info.get("topics", []),
        "Languages": repo_languages,
        "Files": all_files,
        "README": readme_content,
        "Recent Commit Messages": recent_commit_messages,
        "Start Date": repo_info.get("created_at", "Unknown Start Date"),
        "Last Updated": repo_info.get("pushed_at", "Unknown Last Updated"),
    }



def save_to_file(data, filename="repo_data.json"):
    """
    Save the aggregated repository data to a JSON file.
    """
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)
    print(f"Data saved to {filename}")

# Example usage
# owner = "PhongCT1105"
# repo = "SyntheSearch"

# repo_data = aggregate_repo_data(owner, repo, commit_limit=100)

# if repo_data:
#     save_to_file(repo_data)

import requests

def fetch_repo_info(owner, repo, token=None):
    url = f"https://api.github.com/repos/{owner}/{repo}"
    headers = {"Authorization": f"token {token}"} if token else {}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()  # Basic repository info
    else:
        print(f"Error: {response.status_code}, {response.json()}")
        return None
    
def get_repo_structure(owner, repo, path="", token=None):
    """
    Recursively fetch the repository structure, including files and folders.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    headers = {"Authorization": f"token {token}"} if token else {}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error fetching repo structure at path '{path}': {response.status_code}")
        return None

    structure = response.json()
    repo_structure = []

    for item in structure:
        if item["type"] == "file":
            repo_structure.append(item["path"])  # Full path of the file
        elif item["type"] == "dir":
            # Recursively fetch contents of the folder
            sub_structure = get_repo_structure(owner, repo, item["path"], token)
            if sub_structure:
                repo_structure.extend(sub_structure)

    return repo_structure

# Example usage
owner = "PhongCT1105"
repo = "SyntheSearch"
# token = "your_personal_access_token"  # Optional
repo_info = fetch_repo_info(owner, repo)
repo_structure = get_repo_structure(owner, repo)

print(repo_info)
print(repo_structure)

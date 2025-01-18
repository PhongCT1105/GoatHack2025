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

# Example usage
owner = "PhongCT1105"
repo = "SyntheSearch"
# token = "your_personal_access_token"  # Optional
repo_info = fetch_repo_info(owner, repo)
print(repo_info)

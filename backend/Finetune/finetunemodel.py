import openai
import json

def generate_star_resume_section(repo_data):
    """
    Generate a professional and concise project description for a resume using OpenAI API.
    :param repo_data: Dictionary containing GitHub repository details.
    :return: A dictionary with Name, Date, and Description.
    """
    try:
        # Prepare messages for the chat model
        messages = [
            {"role": "system", "content": "You are a professional resume builder."},
            {
                "role": "user",
                "content": f"""
                Repository Details:
                - Repository Name: {repo_data['Repository Name']}
                - Description: {repo_data['Description']}
                - Topics: {', '.join(repo_data.get('Topics', []))}
                - Languages: {json.dumps(repo_data['Languages'], indent=2)}
                - Recent Commit Messages: {', '.join(repo_data.get('Recent Commit Messages')[:5])}

                Generate a professional and concise project description for a resume.
                """
            }
        ]

        # Call the OpenAI API
        response = openai.ChatCompletion.create(
            model="ft:gpt-4o-mini-2024-07-18:personal::ArBP1u7A",  # Replace with your fine-tuned model ID
            messages=messages,
            max_tokens=150,
            stop=["."]
        )

        # Parse the response
        description = response.choices[0].message["content"].strip()

        # Return the structured data
        return {
            "Name": repo_data["Repository Name"],
            "Date": f"{repo_data['Start Date']} - {repo_data['Last Updated']}",
            "Languages": list(repo_data["Languages"].keys()),
            "Description": description
        }

    except Exception as e:
        print(f"Error generating resume section: {e}")
        return None

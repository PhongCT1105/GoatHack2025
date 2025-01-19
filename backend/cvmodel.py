import os
from openai import OpenAI
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(
    api_key=OPENAI_API_KEY,
)

def generate_cover_letter(name, job_title, company_name, job_description, skills):
    """
    Generate a personalized cover letter content using the OpenAI API.
    :param name: Applicant's name.
    :param job_title: Job title for the application.
    :param company_name: Name of the company.
    :param job_description: String containing the job description.
    :param skills: List of skills relevant to the job.
    :return: A string containing the generated cover letter.
    """
    try:
        # Prepare the prompt with the details
        prompt = f"""
        Generate a personalized and professional cover letter for a job application.
        Use the following details:

        Applicant Name: {name}
        Job Title: {job_title}
        Company Name: {company_name}
        Job Description:
        {job_description}

        Relevant Skills:
        {', '.join(skills)}

        The cover letter should:
        - Begin with a strong opening paragraph stating enthusiasm for the role and the company.
        - Include the sentence: 'I am applying for {job_title} at {company_name}.'
        - Mention key qualifications and experiences that align with the job requirements.
        - Highlight how the candidate's skills and experiences will add value to the organization.
        - End with a call-to-action paragraph expressing eagerness for an interview.

        Format the response as:

        Dear Hiring Manager,

        [Opening Paragraph]

        [Body Paragraph 1: Key qualifications and experiences]

        [Body Paragraph 2: How skills and experiences add value to the organization]

        [Closing Paragraph: Call to action]

        Sincerely,
        {name}

        Ensure the cover letter is concise, professional, and tailored to the job description.
        """

        # Call OpenAI API to generate completion
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional cover letter writer"},
                {"role": "user", "content": prompt},
            ]
        )

        # Parse and return the generated cover letter
        return completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"Error generating cover letter: {e}")
        return None

if __name__ == "__main__":
    # Input details
    name = "John Doe"
    job_title = "Software Engineer"
    company_name = "TechCorp Inc."
    job_description = (
        "We are looking for a Software Engineer to join our dynamic team. "
        "The ideal candidate will have experience with React.js, Python, and cloud platforms. "
        "Responsibilities include developing scalable web applications, collaborating with cross-functional teams, and optimizing performance."
    )
    skills = ["React.js", "Python", "Azure", "Agile development", "Problem-solving"]

    # Generate cover letter
    cover_letter = generate_cover_letter(name, job_title, company_name, job_description, skills)

    if cover_letter:
        print("Generated Cover Letter:")
        print(cover_letter)
    else:
        print("Failed to generate cover letter.")

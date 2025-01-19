from pinecone import Pinecone
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# Define index name
index_name = "vecdb"

# Connect to Pinecone index
index = pc.Index(index_name)

# Load resume content
resume_file_path = "resume.txt"  # Ensure the file path is correct
with open(resume_file_path, "r") as file:
    resume_content = file.read()

# Combine query and resume content
query = "Tell me about the tech company known as Apple."
combined_query = f"{query}\n\n{resume_content}"

# Generate embedding for the combined query
embedding = pc.inference.embed(
    model="multilingual-e5-large",
    inputs=[combined_query],
    parameters={
        "input_type": "query"
    }
)

# Query the Pinecone index
results = index.query(
    namespace="ns1",  # Replace with your actual namespace
    vector=embedding[0]["values"],  # Extract the embedding vector
    top_k=3,  # Number of results to fetch
    include_values=False,
    include_metadata=True
)

# Print query results
print("Query Results:")
if results and "matches" in results:
    for match in results["matches"]:
        print(f"Score: {match['score']}")
        print(f"Job Title: {match['metadata'].get('job_title', 'N/A')}")
        print(f"Company Name: {match['metadata'].get('company_name', 'N/A')}")
        # print(f"Job Summary: {match['metadata'].get('job_summary', 'N/A')}")
        print(f"Base Salary: {match['metadata'].get('base_salary', 'N/A')}")
        print(f"Country Code: {match['metadata'].get('country_code', 'N/A')}")
        print("-" * 50)
else:
    print("No matching jobs found.")

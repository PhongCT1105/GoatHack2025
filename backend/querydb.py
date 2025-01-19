from pinecone import Pinecone
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
index_name = "vecdb"  # Define your index name
index = pc.Index(index_name)

def search_pinecone(query: str, namespace: str = "ns1", top_k: int = 10):
    """
    Searches the Pinecone vector database for similar items to the given query.

    Args:
        query (str): The query string to search for.
        namespace (str): The namespace to use in the Pinecone index.
        top_k (int): The number of top results to return.

    Returns:
        list: A list of results with metadata and scores.
    """
    try:
        # Generate embedding for the query
        embedding = pc.inference.embed(
            model="multilingual-e5-large",
            inputs=[query],
            parameters={"input_type": "query"}
        )

        # Query the Pinecone index
        results = index.query(
            namespace=namespace,
            vector=embedding[0]["values"],  # Extract the embedding vector
            top_k=top_k,
            include_values=False,
            include_metadata=True
        )

        if "matches" in results:
            return [
                {
                    "score": match["score"],
                    "job_title": match["metadata"].get("job_title", "N/A"),
                    "company_name": match["metadata"].get("company_name", "N/A"),
                    "base_salary": match["metadata"].get("base_salary", "N/A"),
                    "country_code": match["metadata"].get("country_code", "N/A"),
                }
                for match in results["matches"]
            ]
        else:
            return []

    except Exception as e:
        raise RuntimeError(f"Error querying Pinecone: {e}")

# Testing with resume.txt
if __name__ == "__main__":
    # Load the resume content from the file
    resume_file_path = "resume.txt"  # Ensure the file exists
    if os.path.exists(resume_file_path):
        with open(resume_file_path, "r") as file:
            resume_content = file.read()

        # Test the function with the resume content
        query = "Tell me about the tech company known as Apple."
        combined_query = f"{query}\n\n{resume_content}"

        try:
            results = search_pinecone(query=combined_query, namespace="ns1", top_k=3)
            print("Query Results:")
            for result in results:
                print(result)
        except Exception as e:
            print(f"Error during testing: {e}")
    else:
        print(f"File {resume_file_path} does not exist.")

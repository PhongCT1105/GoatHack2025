from pinecone import Pinecone, ServerlessSpec
import os
import json
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# Define index name
index_name = "vecdb"
pc.delete_index(index_name)

# Check if the index exists
if index_name not in pc.list_indexes():
    pc.create_index(
        name=index_name,
        dimension=1024,  # Assuming Pinecone's model outputs 1024 dimensions
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

# Connect to the Pinecone index
index = pc.Index(index_name)

# Load data from Job.json
job_data_path = "Job.json"  # Replace with the actual file path if needed
with open(job_data_path, "r") as f:
    job_data = [json.loads(line) for line in f]

# Generate embeddings using Pinecone's model and prepare data for upserting
texts = [entry["metadata"]["job_summary"] for entry in job_data]
embeddings = pc.inference.embed(
    model="multilingual-e5-large",  # Replace with your Pinecone model
    inputs=texts,
    parameters={"input_type": "passage", "truncate": "END"}
)

# Wait for the index to be ready
while not pc.describe_index(index_name).status['ready']:
    time.sleep(1)

# Prepare upsert data with embeddings
upsert_data = []
for entry, embedding in zip(job_data, embeddings):
    upsert_data.append({
        "id": entry["id"],
        "values": embedding["values"],
        "metadata": entry["metadata"]
    })

# Upsert data into Pinecone
index.upsert(vectors=upsert_data, namespace="ns1")

# Print index stats
print(index.describe_index_stats())

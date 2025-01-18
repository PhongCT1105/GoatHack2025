import json

input_file = "finetuning_data.jsonl"  # Replace with your input file name
output_file = "chat_formatted_data.jsonl"

with open(input_file, "r", encoding="utf-8") as infile, open(output_file, "w", encoding="utf-8") as outfile:
    for line in infile:
        data = json.loads(line)
        chat_data = {
            "messages": [
                {"role": "system", "content": "You are a professional resume builder."},
                {"role": "user", "content": data["prompt"]},
                {"role": "assistant", "content": data["completion"]}
            ]
        }
        outfile.write(json.dumps(chat_data) + "\n")

print(f"Chat-formatted data saved to {output_file}.")

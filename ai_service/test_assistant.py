import sys
from main import emergency_assistant, ChatRequest

samples = [
    "flood",
    "earthquake",
    "fire",
    "first aid",
    "heat wave",
    "yoga",
    "thunderstorm",
    "hydration",
    "cpr",
    "monsoon",
    "cyclone",
    "landslide",
    "burn treatment",
    "emergency kit",
    "tsunami"
]

output_file = "test_results.md"
print(f"Running {len(samples)} Sample Queries against Wikipedia Chatbot...")

with open(output_file, "w", encoding="utf-8") as f:
    f.write("# Wikipedia Chatbot Test Results\n\n")
    f.write(f"Conducted tests on {len(samples)} different sample queries:\n\n")
    
    for i, sample in enumerate(samples, 1):
        req = ChatRequest(message=sample)
        try:
            response = emergency_assistant(req)
            reply = response["reply"]
        except Exception as e:
            reply = f"ERROR: {str(e)}"
            
        f.write(f"### {i}. Query: `{sample}`\n")
        f.write(f"**Response:**\n{reply}\n\n")
        f.write("---\n\n")

print(f"All tests completed. Results saved to {output_file}")

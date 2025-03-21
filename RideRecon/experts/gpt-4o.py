from dotenv import load_dotenv
from openai import OpenAI
import os
import base64
from pathlib import Path

load_dotenv()

def encode_image(path):
    with open(path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

# Get the script directory and resolve the image path properly
script_dir = Path(__file__).parent.resolve()
project_dir = script_dir.parent  # RideRecon directory
image_path = project_dir / "assets" / "images" / "GT3RS.jpg"

# Print paths for debugging
print(f"Looking for image at: {image_path}")

if not image_path.exists():
    print(f"ERROR: Image file not found! Please check if the following path exists:")
    print(f"  {image_path}")
    exit(1)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

b64_image = encode_image(str(image_path))
print("GPT-4o IMAGE DETECTION\n\n")

prompt = input("Prompt: ")

chat_completion = client.chat.completions.create(
    model="gpt-4o",
    max_tokens=300,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": prompt
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpg;base64,{b64_image}"
                    }
                }
            ]
        }
    ]
)

print("4o reponse:", chat_completion.choices[0].message.content)
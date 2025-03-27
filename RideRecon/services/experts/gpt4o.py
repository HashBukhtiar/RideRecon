from dotenv import load_dotenv
from openai import OpenAI
import os
from .processing import *
from pathlib import Path

load_dotenv()

def gpt4o_identification(image_path):
    client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
    )

    b64_image = image_to_base64(str(image_path))

    prompt =  """
    Please identify the car in this image. Provide the make and model, format your response as JSON with the following structure:
    {
        "make": "Car manufacturer",
        "model": "Car model"
    }
    """

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

    response = chat_completion.choices[0].message.content
    #print("4o reponse:", response)

    return jsonify(response)


if __name__ == "__main__":
    project_root = Path(__file__).parent.parent.parent
    gt3rs_path = str(project_root / "assets" / "images" / "GT3RS.jpg")
    f150_path = str(project_root / "assets" / "images" / "f150.png")
    camry_path = str(project_root / "assets" / "images" / "camry.png")

    print("Car Identification with GPT4o")
    print("--------------------------------------------")
    print(gpt4o_identification(camry_path)) # This is a Python dictionary at this point
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

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
                }
            ]
        }
    ]
)

print(chat_completion.choices[0].message.content)

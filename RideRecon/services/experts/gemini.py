import vertexai
from vertexai.generative_models import GenerativeModel, SafetySetting, Part
from base64_funcs import *
import os
from pathlib import Path
from dotenv import load_dotenv
from json import loads
from PIL import Image
import io

def resize_image(image_path, max_size=(1024, 1024), quality=85):
    """Resize an image to reduce its size"""
    try:
        img = Image.open(image_path)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Convert to RGB if needed (in case of PNG with transparency)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGB')
            
        # Save to bytes
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=quality)
        buffer.seek(0)
        
        return buffer.read()
    except Exception as e:
        print(f"Error resizing image: {e}")
        with open(image_path, "rb") as f:
            return f.read()  # Return original as fallback

def load_environment():
    script_dir = Path(os.path.dirname(os.path.abspath(__file__)))
    
    env_path = script_dir.parent.parent / '.env'
    
    if env_path.exists():
        print(f"Loading environment from {env_path}")
        load_dotenv(dotenv_path=env_path)
    else:
        print(f"Warning: .env file not found at {env_path}")
        # Try alternative locations
        alt_path = Path(os.getcwd()) / '.env'
        if alt_path.exists():
            print(f"Loading environment from {alt_path}")
            load_dotenv(dotenv_path=alt_path)
        else:
            print(f"Warning: .env file not found at {alt_path} either")

def gemini_gcp_identification(image_path):
    load_environment()
    project_id = os.environ.get('GCP_PROJECT_ID')
    region = os.environ.get('GCP_REGION')

    if project_id and region:
        print(f"Using GCP Project: {project_id} in region: {region}")
        vertexai.init(project=project_id, location=region)
    else:
        print("Warning: GCP_PROJECT_ID or GCP_REGION not found in environment")

    model = GenerativeModel("gemini-1.0-pro-vision")
    
    print("Processing image...")
    # Resize the image to reduce size
    image_data = resize_image(image_path)
    print(f"Resized image size: {len(image_data)/1024:.2f} KB")
    
    # Create a proper Part object from the image
    image_part = Part.from_data(mime_type="image/jpeg", data=image_data)
    
    raw_prompt = """
    Please identify the car in this image. Provide the make and model, format your response as JSON with the following structure:
    {
        "make": "Car manufacturer",
        "model": "Car model"
    }
    """
    user_prompt = Part.from_text(raw_prompt)
    
    print("Analyzing image...")
    
    response = model.generate_content(
        [image_part, user_prompt],
        safety_settings=[
            SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="BLOCK_MEDIUM_AND_ABOVE"),
            SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="BLOCK_MEDIUM_AND_ABOVE"),
            SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="BLOCK_MEDIUM_AND_ABOVE"),
            SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="BLOCK_MEDIUM_AND_ABOVE"),
        ],
    )
    
    print("\nGemini's Response:")
    print(response.text)

    car_info = loads(response.text) # Return python dictionary
    return car_info

if __name__ == "__main__":
    project_root = Path(__file__).parent.parent.parent
    gt3rs_path = str(project_root / "assets" / "images" / "GT3RS.jpg")
    f150_path = str(project_root / "assets" / "images" / "f150.png")
    camry_path = str(project_root / "assets" / "images" / "camry.png")

    print("Car Identification with Gemini 1.0 Pro Vision")
    print("--------------------------------------------")
    print(gemini_gcp_identification(camry_path)) # This is a Python dictionary at this point
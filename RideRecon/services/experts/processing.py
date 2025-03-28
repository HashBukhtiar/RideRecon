from pathlib import Path
import base64
import os
from PIL import Image
import io
from json import loads

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

def image_to_base64(image_path):
    """
    Convert an image to base64 encoded string
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        str: Base64 encoded string
    """
    try:
        # Handle both relative and absolute paths
        absolute_path = os.path.abspath(image_path)
        
        # Check if file exists
        if not os.path.exists(absolute_path):
            # Try to resolve path relative to project root
            project_root = Path(__file__).parent.parent.parent  # Go up to RideRecon folder
            alternate_path = project_root / "assets" / "images" / os.path.basename(image_path)
            
            if os.path.exists(alternate_path):
                absolute_path = str(alternate_path)
            else:
                raise FileNotFoundError(f"Image not found at {image_path} or {alternate_path}")
        
        print(f"Reading image from {absolute_path}")
        with open(absolute_path, "rb") as image_file:
            binary_data = image_file.read()
            base64_encoded = base64.b64encode(binary_data)
            return base64_encoded.decode('utf-8')
    except Exception as e:
        print(f"Error converting image to base64: {e}")
        raise

def jsonify(response):
    try:
        response_str = str(response)
        start_idx = response_str.find('{')
        end_idx = response_str.find('}')
        
        if start_idx == -1 or end_idx == -1 or end_idx <= start_idx:
            return "{}"
        
        return loads(response_str[start_idx:end_idx+1])
    except Exception as e:
        print(f"Error extracting JSON: {e}")
        return "{}"
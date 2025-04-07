from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import base64
import sys
from pathlib import Path
import uuid

# Add the parent directory to sys.path so we can import the services
sys.path.append(str(Path(__file__).parent.parent))
from services.finalizer import finalize

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/identify', methods=['POST'])
def identify_car():
    try:
        # Check if image data is in the request
        if 'image' not in request.json:
            return jsonify({
                "error": "No image data provided"
            }), 400
            
        # Get the base64 encoded image
        base64_img = request.json['image']
        
        # Optional description
        description = request.json.get('description', '')
        
        # Remove the data URL prefix if present
        if ',' in base64_img:
            base64_img = base64_img.split(',')[1]
            
        # Create a temporary file to store the image
        img_data = base64.b64decode(base64_img)
        
        # Generate a unique filename
        temp_dir = Path(tempfile.gettempdir())
        filename = f"{uuid.uuid4()}.jpg"
        temp_path = temp_dir / filename
        
        # Save the image
        with open(temp_path, 'wb') as f:
            f.write(img_data)
            
        print(f"Image saved to: {temp_path}")
        
        # Call the finalizer function with the image path
        result = finalize(str(temp_path))
        
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        # Return the identification result
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == '__main__':
    # Default port is 8080 for Cloud Run
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
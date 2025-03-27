from experts.gemini import *
from experts.gpt4o import *
from experts.ris import *
from pathlib import Path
import os

def finalize(image_path):
    print(f"Processing image at path: {image_path}")
    print(f"File exists: {os.path.exists(image_path)}")
    
    gpt4o_response_json = gpt4o_identification(image_path)
    print("\nGPT-4o identified:", gpt4o_response_json, '\n')
    
    gemini_response_json = gemini_gcp_identification(image_path)
    print("\nGemini identified:", gemini_response_json, '\n')
    
    ris_response_json = reverse_image_search_identification(image_path)
    print("\nRIS identified:", ris_response_json, '\n')

    # Simple voting mechanism for final result
    make_votes = {}
    model_votes = {}
    
    for response in [gpt4o_response_json, gemini_response_json, ris_response_json]:
        if 'make' in response:
            make = response['make'].lower()
            make_votes[make] = make_votes.get(make, 0) + 1
        if 'model' in response:
            model = response['model'].lower()
            model_votes[model] = model_votes.get(model, 0) + 1
    
    final_make = max(make_votes.items(), key=lambda x: x[1])[0] if make_votes else "Unknown"
    final_model = max(model_votes.items(), key=lambda x: x[1])[0] if model_votes else "Unknown"
    
    final_result = {
        "make": final_make.title(),
        "model": final_model.title(),
        "confidence": f"{round(max(make_votes.values()) / 3,1) * 100 if make_votes else 0}%"
    }
    
    print("\nFinal identification:", final_result)
    return final_result


if __name__ == "__main__":
    # Calculate the correct path to the current file
    current_file = Path(__file__)
    # Find the project root - the directory containing the assets folder
    project_root = None
    
    # Start from the current directory and go up until we find assets/images
    check_dir = current_file.parent
    for _ in range(5):  # Try up to 5 levels up
        if (check_dir / "assets" / "images").exists():
            project_root = check_dir
            break
        check_dir = check_dir.parent
    
    if not project_root:
        # Fallback to the expected structure
        project_root = Path(__file__).parent.parent
    
    print(f"Project root: {project_root}")
    
    # Define image paths
    gt3rs_path = str(project_root / "assets" / "images" / "GT3RS.jpg")
    f150_path = str(project_root / "assets" / "images" / "f150.png")
    camry_path = str(project_root / "assets" / "images" / "camry.png")
    wagon_path = str(project_root / "assets" / "images" / "wagon.jpg")
    
    # Verify images exist
    print(f"GT3RS exists: {os.path.exists(gt3rs_path)}")
    print(f"F150 exists: {os.path.exists(f150_path)}")
    print(f"Camry exists: {os.path.exists(camry_path)}")
    print(f"Wagon exists: {os.path.exists(wagon_path)}")
    
    # Choose image
    finalize(gt3rs_path)
    #finalize(f150_path)
    #finalize(camry_path)
    #finalize(wagon_path)
    
    '''image_to_use = None
    for img_path in [gt3rs_path, f150_path, camry_path]:
        if os.path.exists(img_path):
            image_to_use = img_path
            break
    
    if image_to_use:
        print(f"Using image: {image_to_use}")
        finalize(image_to_use)
    else:
        print("No valid images found!")'''
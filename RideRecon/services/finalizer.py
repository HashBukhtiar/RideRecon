from experts.gemini import *
from experts.gpt4o import *
from experts.ris import *
from pathlib import Path
import os
from difflib import SequenceMatcher

def similarity(s1, s2):
    s1 = str(s1).lower()
    s2 = str(s2).lower()
    
    return SequenceMatcher(None, s1, s2).ratio()

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
    confidence = 33
    final_make = gpt4o_response_json['make']
    final_model = gpt4o_response_json['model']

    for response in [gemini_response_json, ris_response_json]:
        confidence += 16.75*similarity(response['make'], gpt4o_response_json['make']) + 16.75*similarity(response['model'], gpt4o_response_json['model'])
    
    final_result = {
        "make": final_make.title(),
        "model": final_model.title(),
        "confidence": f"{round(confidence,2)}%"
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
    svj_path = str(project_root / "assets" / "images" / "svj.png")
    
    # Verify images exist
    print(f"GT3RS exists: {os.path.exists(gt3rs_path)}")
    print(f"F150 exists: {os.path.exists(f150_path)}")
    print(f"Camry exists: {os.path.exists(camry_path)}")
    print(f"Wagon exists: {os.path.exists(wagon_path)}")
    print(f"SVJ exists: {os.path.exists(svj_path)}")
    
    # Choose image
    #finalize(gt3rs_path)
    #finalize(f150_path)
    #finalize(camry_path)
    #finalize(wagon_path)
    finalize(svj_path)

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
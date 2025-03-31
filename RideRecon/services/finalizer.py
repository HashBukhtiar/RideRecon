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

def get_common_marketplaces(make, model):
    make_model = f"{make} {model}".replace(" ", "+")
    
    return [
        {
            "name": "AutoTrader",
            "url": f"https://www.autotrader.com/cars-for-sale/{make_model}"
        },
        {
            "name": "Cars.com",
            "url": f"https://www.cars.com/shopping/results/?stock_type=all&makes%5B%5D={make}&models%5B%5D={model}"
        },
        {
            "name": "CarGurus",
            "url": f"https://www.cargurus.com/Cars/l-Used-{make}-{model}-d138"
        }
    ]

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
        "confidence": f"{round(confidence,2)}%",
    }

    fun_fact = gpt4o_fact(final_result['make'], final_result['model'])
    print(fun_fact)

    purchase_sources = get_common_marketplaces(final_result['make'], final_result['model'])
    purchase_urls = [purchase_sources[0]['url'], purchase_sources[1]['url'], purchase_sources[2]['url']]

    print(purchase_urls)

    final_result['fact'] = fun_fact
    final_result['source'] = purchase_urls
    
    print("\n\nFinal identification:", final_result)    

    return final_result


if __name__ == "__main__":
    current_file = Path(__file__)
    project_root = None
    
    check_dir = current_file.parent
    for _ in range(5):  # Try up to 5 levels up
        if (check_dir / "assets" / "images").exists():
            project_root = check_dir
            break
        check_dir = check_dir.parent
    
    if not project_root:
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
    finalize(gt3rs_path)
    #finalize(f150_path)
    #finalize(camry_path)
    #finalize(wagon_path)
    #finalize(svj_path) 
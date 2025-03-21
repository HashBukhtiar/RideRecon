from google.cloud import vision
import io
from pathlib import Path
import os
from dotenv import load_dotenv
from collections import Counter
import re

load_dotenv()

def identify_car_with_vision(image_path):
    """
    Identify car using Google Vision API with brand-agnostic analysis
    
    Args:
        image_path: Path to the car image file
    
    Returns:
        dict: Car information with confidence scores
    """
    # Initialize the client
    client = vision.ImageAnnotatorClient()
    
    # Read the image
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()
    
    image = vision.Image(content=content)
    
    # Get labels (general identification)
    label_response = client.label_detection(image=image)
    labels = [(label.description, label.score) for label in label_response.label_annotations]
    
    # Get web entities (might include make/model)
    web_response = client.web_detection(image=image)
    web_entities = [(entity.description, entity.score) for entity in web_response.web_detection.web_entities]
    
    # Common car manufacturers - expanded list
    car_brands = {
        # Luxury/Sports
        "porsche": ["911", "cayenne", "macan", "taycan", "panamera", "cayman", "boxster", "gt2", "gt3", "gt4", "rs"],
        "ferrari": ["458", "488", "f8", "roma", "portofino", "812", "sf90", "laferrari"],
        "lamborghini": ["aventador", "huracan", "urus", "gallardo", "countach", "murcielago"],
        "bugatti": ["veyron", "chiron", "divo"],
        "aston martin": ["db11", "vantage", "dbs", "dbx"],
        "mclaren": ["720s", "570s", "gt", "senna", "speedtail"],
        
        # German
        "bmw": ["m3", "m4", "m5", "x5", "x3", "330i", "530i", "740i", "z4"],
        "mercedes": ["c-class", "e-class", "s-class", "a-class", "gle", "gls", "amg"],
        "audi": ["a4", "a6", "a8", "q5", "q7", "rs", "r8", "e-tron", "tt"],
        "volkswagen": ["golf", "passat", "tiguan", "atlas", "jetta", "polo", "id.4", "gti"],
        
        # Japanese
        "toyota": ["camry", "corolla", "rav4", "highlander", "tacoma", "tundra", "supra", "86", "prius"],
        "honda": ["civic", "accord", "cr-v", "pilot", "ridgeline", "odyssey", "fit"],
        "nissan": ["altima", "sentra", "rogue", "pathfinder", "frontier", "titan", "leaf", "gt-r", "z"],
        "lexus": ["rx", "nx", "es", "ls", "is", "gs", "gx", "lx", "ux", "rc", "lc"],
        "mazda": ["cx-5", "cx-9", "mazda3", "mazda6", "mx-5", "miata"],
        "subaru": ["forester", "outback", "crosstrek", "impreza", "wrx", "sti", "legacy"],
        
        # American
        "ford": ["f-150", "mustang", "explorer", "escape", "edge", "ranger", "bronco", "mach-e"],
        "chevrolet": ["silverado", "tahoe", "suburban", "camaro", "corvette", "malibu", "equinox"],
        "dodge": ["challenger", "charger", "durango", "ram"],
        "tesla": ["model s", "model 3", "model x", "model y"],
        
        # Korean
        "hyundai": ["elantra", "sonata", "tucson", "santa fe", "kona", "palisade"],
        "kia": ["telluride", "sorento", "sportage", "forte", "k5", "stinger", "soul"]
    }
    
    # Body types and styles for detail extraction
    body_types = ["sedan", "coupe", "convertible", "hatchback", "suv", "crossover", "pickup", "truck", 
                 "wagon", "minivan", "roadster", "spyder", "targa"]
    
    performance_indicators = ["sport", "gt", "rs", "m", "amg", "v8", "v10", "v12", "turbo", 
                             "supercharged", "sti", "type r", "gtr", "hellcat", "ss", "shelby"]
    
    # Store all potential makes and models with scores
    potential_cars = []
    
    # Analyze web entities for make and model
    for entity, score in web_entities:
        # Skip low confidence results
        if score < 0.3:
            continue
            
        entity_lower = entity.lower()
        
        # Check if this entity mentions a car brand
        brand_found = None
        brand_models = []
        
        for brand, models in car_brands.items():
            if brand in entity_lower:
                brand_found = brand
                brand_models = models
                break
        
        if brand_found:
            # This entity contains a car brand
            model_found = "unknown"
            
            # Check if any known models for this brand are mentioned
            for model in brand_models:
                if model.lower() in entity_lower:
                    model_found = model
                    break
            
            potential_cars.append({
                "text": entity,
                "score": score,
                "brand": brand_found.title(),
                "model_keyword": model_found,
                "is_full_model": len(entity.split()) > 1  # Likely includes model if more than one word
            })
    
    # Count brand occurrences for determining most likely make
    brand_counter = Counter()
    for car in potential_cars:
        brand_counter[car["brand"]] += car["score"]
    
    # Determine most likely make
    most_likely_make = brand_counter.most_common(1)[0][0] if brand_counter else "Unknown"
    
    # Find most likely full model (entities with both make and model)
    full_models = [car for car in potential_cars if car["is_full_model"] and car["brand"] == most_likely_make]
    full_models.sort(key=lambda x: x["score"], reverse=True)
    
    most_likely_model = full_models[0]["text"] if full_models else "Unknown Model"
    confidence = max([car["score"] for car in potential_cars]) if potential_cars else 0.0
    
    # Extract model details generically
    model_details = {}
    
    # Extract year if present
    year_pattern = r'(19|20)\d{2}'
    years = []
    
    for entity in [car["text"] for car in potential_cars]:
        year_matches = re.findall(year_pattern, entity)
        years.extend(year_matches)
    
    if years:
        model_details["year"] = max(years)  # Most recent year mentioned
    
    # Extract body type if present
    for body_type in body_types:
        model_text = most_likely_model.lower()
        if body_type in model_text:
            model_details["body_type"] = body_type
            break
    
    # Extract performance indicators
    for indicator in performance_indicators:
        if indicator.lower() in most_likely_model.lower():
            if "performance" not in model_details:
                model_details["performance"] = []
            model_details["performance"].append(indicator)
    
    # Brand-specific logic
    if most_likely_make == "Porsche":
        # Look for specific Porsche info
        if any(gen in most_likely_model for gen in ["991", "992", "996", "997"]):
            for gen in ["991", "992", "996", "997"]:
                if gen in most_likely_model:
                    model_details["generation"] = gen
                    break
    
    elif most_likely_make == "BMW":
        # Extract BMW series and generation
        series_pattern = r'[mM]?(\d)[- ]?[sS]eries'
        generation_pattern = r'[eE](\d+)'
        series_match = re.search(series_pattern, most_likely_model)
        gen_match = re.search(generation_pattern, most_likely_model)
        
        if series_match:
            model_details["series"] = series_match.group(1)
            
        if gen_match:
            model_details["generation"] = gen_match.group(1)
    
    elif most_likely_make == "Mercedes":
        # Check for Mercedes class and AMG
        if "amg" in most_likely_model.lower():
            if "performance" not in model_details:
                model_details["performance"] = []
            model_details["performance"].append("AMG")
        
        class_pattern = r'([a-zA-Z])[-– ]?[cC]lass'
        class_match = re.search(class_pattern, most_likely_model)
        if class_match:
            model_details["class"] = class_match.group(1).upper()
            
    # Add more brand-specific logic here as needed
                
    return {
        "make": most_likely_make,
        "model": most_likely_model,
        "confidence": confidence,
        "details": model_details,
        "all_candidates": potential_cars,
        "raw_labels": labels,
        "raw_entities": web_entities
    }

# Get the script directory and resolve the image path
script_dir = Path(__file__).parent.resolve()
project_dir = script_dir.parent
image_path = project_dir / "assets" / "images" / "camry.png"

print(f"Analyzing car image at: {image_path}")

# Identify the car
result = identify_car_with_vision(str(image_path))

print("\n=== REVERSE IMAGE SEARCH IDENTIFICATION RESULTS ===")
print(f"Make: {result['make']}")
print(f"Full Model: {result['model']}")
print(f"Confidence: {result['confidence']:.2f}")

if result['details']:
    print("\nModel Details:")
    for key, value in result['details'].items():
        print(f"- {key}: {value}")

print("\nTop 3 Candidates:")
for car in sorted(result['all_candidates'], key=lambda x: x['score'], reverse=True)[:3]:
    print(f"- {car['text']} (confidence: {car['score']:.2f})")
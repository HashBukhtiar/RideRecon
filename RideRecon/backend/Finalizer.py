import json


def finalizer(gpt4o,gemini,ris,g8m):
    gpt4o = json.loads(gpt4o)
    gemini = json.loads(gemini)
    ris = json.loads(ris)
    g8m = json.loads(g8m)
    
    baseline_make = gpt4o["make"]
    baseline_model = gpt4o["model"]

    experts = [gemini,ris,g8m]

    confidence = 50

    for expert in experts:
        if expert["make"] == baseline_make:
            confidence += 50/6
        if expert["model"] == baseline_model:
            confidence += 50/6
    
    out_info = {"make": baseline_make, "model": baseline_model, "confidence": round(confidence,1)}

    return out_info




gpt4o = { # final answer no matter what, other experts affect overall confidence (DELETE THIS COMMNE)
    "make": "Porsche",
    "model": "911 GT3 RS"
}
gemini = {
    "make": "Porsche",
    "model": "911 GT3 RS"
}
ris = {
    "make": "Porsche",
    "model": "911 GT3 RS"
}
g8m = {
    "make": "Porsche",
    "model": "911 GT3 RS"
}

gpt4o = json.dumps(gpt4o)
gemini = json.dumps(gemini)
ris = json.dumps(ris)
g8m = json.dumps(g8m)

'''
ris = {
    "make": "Porsche",
    "model": "911 Turbo S"
}
g8m = {
    "make": "Porsche",
    "model": "911 Turbo S"
}

'''
if __name__ == "__main__":
    print(finalizer(gpt4o, gemini, ris, g8m))
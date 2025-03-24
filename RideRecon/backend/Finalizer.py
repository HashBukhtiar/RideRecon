import json


def finalizer(gpt4o,gemini,ris,g8m):
    baseline_make = gpt4o["make"]
    baseline_model = gpt4o["model"]

    experts = [gemini,ris,g8m]

    confidence = 50

    for expert in experts:
        if expert["make"] == baseline_make:
            confidence += 50/6
        if expert["model"] == baseline_model:
            confidence += 50/6
    
    return round(confidence,1)




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
    "model": "911 Turbo S"
}
g8m = {
    "make": "Porsche",
    "model": "911 Turbo S"
}


if __name__ == "__main__":
    print(finalizer(gpt4o, gemini, ris, g8m))
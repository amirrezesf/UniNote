import json


with open("all-models.json", "r", encoding="utf-8") as f:
    all_models = json.load(f)
    all_models = all_models["data"]

names = []
for model in all_models:
    name = model["name"]
    names.append(name)

with open("model_names.json", "w", encoding="utf-8") as f:
    json.dump(names, f, indent=4)
    
# packages/proto/src/api/py
import requests
import json

api_url = "https://api.nal.usda.gov/fdc/v1/foods/search"
api_key = "orSPiwlxKXVJismcPT9O3UDgfUi3g7rIvjnqBkma"

query_params = {
    "api_key": api_key,
    "query": "strawberries, raw",
    "pageSize": 1,
}

response = requests.get(api_url, params=query_params)

if (response.status_code != 200):
    print(json.dumps({"error": response.text}))
    exit(1)

nutrients = {}

data = response.json()
food = data["foods"][0]
for nutrient in food.get("foodNutrients"):
    value = nutrient.get("value")
    unit = nutrient.get("unitName")

    if value is None:
        continue

    # convert to grams
    if (unit == "MG"):
        value
    elif (unit == "UG"):
        value

    nutrients[nutrient["nutrientName"]] = value

result = {
    "name": food["description"],
    "fdc_id": food["fdcId"],
    "nutrients": nutrients
}

print(json.dumps(result))
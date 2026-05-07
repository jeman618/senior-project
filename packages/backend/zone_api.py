# packages/backend/zone_api.py

import requests

zip_code = "93420"
url = f"https://plant-hardiness-zone.p.rapidapi.com/zipcodes/{zip_code}"

headers = {
	"x-rapidapi-key": "c487d7582fmshc6a2c58bbd736c1p136038jsn2e0ad6cfdb5d",
	"x-rapidapi-host": "plant-hardiness-zone.p.rapidapi.com"
}

response = requests.get(url, headers=headers)
data = response.json()

print(data["zipcode"])
print(data["hardiness_zone"])
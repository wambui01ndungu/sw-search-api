#service.py
import requests

def fetch_starwars_people(search_term):
    url = f"https://swapi.dev/api/people/?search={search_term}"
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    return response.json().get("results",[])

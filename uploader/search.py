import requests
import os
from dotenv import load_dotenv
load_dotenv()

def search_twelve_labs(query):
    url = "https://api.twelvelabs.io/v1.2/search"
    payload = {
        "search_options": ["visual", "conversation"],
        "adjust_confidence_level": 0.5,
        "group_by": "clip",
        "threshold": "low",
        "sort_option": "score",
        "operator": "or",
        "conversation_option": "semantic",
        "page_limit": 50,
        "query": query,  # Use the input query here
        "index_id": os.getenv("TL_INDEX")  # Replace with your actual index ID
    }
    headers = {
        "accept": "application/json",
        "x-api-key": os.getenv("TL_API_KEY"),  # Replace with your actual API key
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Request failed", "status_code": response.status_code, "message": response.text}

if __name__ == "__main__":
    query = input("Enter your query: ")  # Get query from user input
    result = search_twelve_labs(query)
    print(result)
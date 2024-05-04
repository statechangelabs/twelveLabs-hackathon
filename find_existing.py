import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Replace these with your actual values
API_KEY = os.getenv("TL_API_KEY")
INDEX_ID = os.getenv("TL_INDEX")

# Base URL for the API request
base_url = f"https://api.twelvelabs.io/v1.1/indexes/{INDEX_ID}/videos"


# Function to get filenames from a single page
def get_filenames_from_page(page):
    params = {
        "page": page,
        "page_limit": 10,
        "sort_by": "created_at",
        "sort_option": "desc",
    }
    headers = {
        "Content-Type": "application/json",
        "accept": "application/json",
        "x-api-key": API_KEY,
    }
    response = requests.get(base_url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        filenames = [video["metadata"]["filename"] for video in data["data"]]
        return filenames, data["page_info"]["total_page"]
    else:
        raise Exception(
            f"API request failed with status code {response.status_code}: {response.text}"
        )


# Retrieve all filenames from all pages
def get_all_filenames():
    page = 1
    all_filenames = []
    total_pages = 1

    while page <= total_pages:
        filenames, total_pages = get_filenames_from_page(page)
        all_filenames.extend(filenames)
        page += 1

    return all_filenames


# Fetch all filenames
all_filenames = get_all_filenames()
for filename in all_filenames:
    print(filename)

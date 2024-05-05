from glob import glob
import os
from dotenv import load_dotenv
import requests
import sys

# Assuming TwelveLabs and Task are correctly imported as before
from twelvelabs import TwelveLabs
from twelvelabs.models.task import Task

load_dotenv()

# Initialize TwelveLabs client
client = TwelveLabs(api_key=os.getenv("TL_API_KEY"))
API_KEY = os.getenv("TL_API_KEY")
INDEX_ID = os.getenv("TL_INDEX")
# print("Index id:", INDEX_ID)
# sys.exit(0)
# Base URL for the API request to get existing filenames
base_url = f"https://api.twelvelabs.io/v1.1/indexes/{INDEX_ID}/videos"


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


def get_all_filenames():
    page = 1
    all_filenames = []
    total_pages = 1
    while page <= total_pages:
        filenames, total_pages = get_filenames_from_page(page)
        all_filenames.extend(filenames)
        page += 1
    return all_filenames


# Fetch all existing filenames
existing_filenames = set(get_all_filenames())

video_files = glob("./clips/*.mp4")

for video_file in video_files:
    video_filename = os.path.basename(video_file)
    if video_filename in existing_filenames:
        print(
            f"File '{video_filename}' is already uploaded. Skipping to the next video."
        )
        continue

    try:
        print(f"Uploading {video_filename}")
        # Assuming task creation and upload logic remains the same
        task = client.task.create(index_id=INDEX_ID, file=video_file, language="en")
        print(f"Task id={task.id}")

        def on_task_update(task: Task):
            print(f"  Status={task.status}")

        task.wait_for_done(callback=on_task_update)

        if task.status != "ready":
            raise RuntimeError(f"Indexing failed with status {task.status}")

        print(
            f"Uploaded {video_filename}. The unique identifier of your video is {task.video_id}."
        )

    except RuntimeError as e:
        print(f"Error uploading {video_filename}: {e}")
        # Continue with the next video

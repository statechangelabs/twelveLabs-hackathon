import os
import subprocess


def download_video_and_chapters(url):
    # Define the directory where you want to save the videos and chapter info
    download_dir = "downloaded"
    os.makedirs(download_dir, exist_ok=True)

    # Extract video ID from URL
    video_id = url.split("=")[-1]

    # Check if the chapters file for this video already exists
    chapters_file_path = f"{download_dir}/{video_id}_chapters.txt"
    if os.path.exists(chapters_file_path):
        print(f"Chapters file for {url} already exists. Skipping download.")
        return

    # Command to download video in mp4 format
    download_command = f"yt-dlp -f mp4 --write-info-json --output '{download_dir}/%(title)s.%(ext)s' {url}"
    # Command to extract chapter information
    # chapters_command = f"yt-dlp --list-chapters {url}"

    try:
        # Download video
        subprocess.run(download_command, shell=True, check=True)
        # Extract and save chapter information
        # result = subprocess.run(
        #     chapters_command, shell=True, check=True, capture_output=True, text=True
        # )
        # chapters_info = result.stdout

        # Save chapters info to a file
        # with open(chapters_file_path, "w") as file:
        #     file.write(chapters_info)
        print(f"Downloaded and saved chapters for {url}")
    except subprocess.CalledProcessError as e:
        print(f"Error downloading {url}: {e}")


def main():
    # Read URLs from file
    with open("urls.txt", "r") as file:
        urls = file.read().splitlines()

    # Download each video and its chapters
    for url in urls:
        download_video_and_chapters(url)


if __name__ == "__main__":
    main()

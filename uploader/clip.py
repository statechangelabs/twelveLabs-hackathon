import os
import requests
import subprocess
import shutil
import boto3
from botocore.exceptions import NoCredentialsError

def download_video(url, file_path):
    """Downloads a file from a URL to the specified file path."""
    response = requests.get(url)
    with open(file_path, 'wb') as file:
        file.write(response.content)
        
def upload_to_spaces(file_path, bucket_name, object_name=None):
    """Upload a file to Digital Ocean Spaces"""
    # Set the necessary parameters
    spaces_key = 'DO00XEU3UBLGTFT9BD2Q'
    spaces_secret = 'FgVMUIit2vkVvxlVxa2nfea2s9qPhJOV6lEwHFyL+lM'
    region_name = 'nyc3'  # Change to your region
    endpoint_url = 'https://nyc3.digitaloceanspaces.com'  # Change to your endpoint URL

    # Create session
    session = boto3.session.Session()
    client = session.client('s3',
                            region_name=region_name,
                            endpoint_url=endpoint_url,
                            aws_access_key_id=spaces_key,
                            aws_secret_access_key=spaces_secret)

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = "shorts/" + os.path.basename(file_path)

    # Upload the file
    try:
        client.upload_file(file_path, bucket_name, object_name, ExtraArgs={'ACL': 'public-read'})
        print(f"File {file_path} uploaded to {bucket_name}/{object_name}")
    except NoCredentialsError:
        print("Credentials not available")
        
     # Construct the URL of the uploaded file
    file_url = f"{endpoint_url}/{bucket_name}/{object_name}"
    return file_url

def resize_and_segment_video(input_path, output_path, start_time, end_time):
    """Resizes a video to a YouTube Shorts format and saves the segmented output using FFmpeg CLI."""
    command = [
        'ffmpeg',
        '-ss', str(start_time),
        '-to', str(end_time),
        '-i', input_path,
        '-vf', 'crop=ih*(9/16):ih',
        '-crf', '21',
        '-c:a', 'copy',  # Copy audio stream without re-encoding
        output_path
    ]
    subprocess.run(command, check=True)
    
def concatenate_videos(video_files, output_path):
    """Concatenates multiple video files into a single video file."""
    with open('temp_list.txt', 'w') as f:
        for file in video_files:
            f.write(f"file '{file}'\n")
    command = [
        'ffmpeg',
        '-f', 'concat',
        '-safe', '0',
        '-i', 'temp_list.txt',
        '-c', 'copy',
        output_path
    ]
    subprocess.run(command, check=True)
    os.remove('temp_list.txt')  # Clean up the temporary file list

def get_media_duration(file_path):
    """Returns the duration of a media file (video or audio) in seconds."""
    try:
        result = subprocess.run(
            ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            check=True
        )
        return float(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error getting media duration: {e.output}")
        return 0
    
def overlay_audio(video_path, audio_path, output_path):
    """Overlays audio onto video, trimming to the length of the shorter media file."""
    video_duration = get_media_duration(video_path)
    audio_duration = get_media_duration(audio_path)
    shortest_duration = min(video_duration, audio_duration, 60)
    
    command = [
        'ffmpeg',
        '-i', video_path,
        '-i', audio_path,
        '-t', str(shortest_duration),
        '-c:v', 'copy',
        '-map', '0:v:0',
        '-map', '1:a:0',
        output_path
    ]
    subprocess.run(command, check=True)


def process_videos(input):
    """Processes video objects to download, segment, resize, and save to 'shorts/', then deletes the original download."""
    uuid = input['id']
    # print("uuid is:",uuid)
    temp_folder = f"temp_{uuid}/"
    # os.makedirs(temp_folder, exist_ok=True)
    if not os.path.exists(temp_folder):
        os.makedirs(temp_folder)
    generated_folder = f"generated_{uuid}/"
    os.makedirs(generated_folder, exist_ok=True)
    
    processed_videos = []
    
    for video in video_objects:
        # Extract relevant data from the video object
        file_url = video.get('file_url')
        start_time = video.get('start')
        end_time = video.get('end')
        filename = video.get('filename', 'default_video.mp4')  # Use 'default_video.mp4' if filename is not available
        
        # Define the local file path for downloading
        video_file_path = f"{temp_folder}{filename}"
        
        # Download the video file if it does not already exist
        if not os.path.exists(video_file_path):
            print(f"Downloading video: {video_file_path}")
            download_video(file_url, video_file_path)
        
        # Define the output file path for the short video
        short_filename = f"{filename.split('.')[0]}_short.mp4"
        output_path = f"{temp_folder}{short_filename}"
        
        # Resize and segment the video
        resize_and_segment_video(video_file_path, output_path, start_time, end_time)
        print(f"Saved short to: {output_path}")
        
        processed_videos.append(output_path)
        
        # Delete the original downloaded video
        os.remove(video_file_path)
        print(f"Deleted original video: {video_file_path}")

    # Concatenate all processed videos
    final_output_path = f"{generated_folder}final_video_{uuid}.mp4"
    concatenate_videos(processed_videos, final_output_path)
    print(f"Final video saved to: {final_output_path}")
    
     # If an "audio" key exists, overlay the audio onto the final video
    if 'audio' in input and os.path.exists(input['audio']):
        audio_path = input['audio']
        final_with_audio_path = f"{generated_folder}final_with_audio_{uuid}.mp4"
        overlay_audio(final_output_path, audio_path, final_with_audio_path)
        print(f"Final video with audio saved to: {final_with_audio_path}")

    # After processing and optionally overlaying audio
    final_output_path = f"{generated_folder}final_video_{uuid}.mp4"
    # Or final_with_audio_path if audio is processed
    final_video_path = final_with_audio_path if 'audio' in input and os.path.exists(input['audio']) else final_output_path

    # Upload the final video to Digital Ocean Spaces
    bucket_name = 'scl-chessboxing'  # Your Digital Ocean Spaces bucket name
    # Delete the temp directory after processing is done
    shutil.rmtree(temp_folder)
    print(f"Deleted temp directory: {temp_folder}")
    file_url = upload_to_spaces(final_video_path, bucket_name)
    shutil.rmtree(generated_folder)
    print(f"Deleted generate directory: {generated_folder}")
    return file_url
    
    
# Example usage
video_objects = [
    {
        "score": 86.34,
        "start": 1046.97,
        "end": 1086.20,
        "video_id": "66367f7dd1cd5a287c957c9f",
        "file_url": "https://scl-chessboxing.nyc3.digitaloceanspaces.com/clips/MOGUL%20CHESSBOXING%20CHAMPIONSHIP%20PRESENTED%20BY%20FANSLY%20%EF%BD%9C%20%21FANSLY%20%23FANSLYPARTNER_Fiction%20vs%20KJH_chapter_3_part_1.mp4",
        "filename": "MOGUL CHESSBOXING CHAMPIONSHIP PRESENTED BY FANSLY ｜ !FANSLY #FANSLYPARTNER_Fiction vs KJH_chapter_3_part_1.mp4"
    },
    {
        "score": 86.1,
        "start": 661.8000000000554,
        "end": 681.8833333333714,
        "video_id": "66367ac1d1cd5a287c957c96",
        "file_url": "https://scl-chessboxing.nyc3.digitaloceanspaces.com/clips/Highest%20Elo%20Rated%20Chessboxing%20Match%20of%20All%20Time_part_1.mp4",
        "filename": "Highest Elo Rated Chessboxing Match of All Time_part_1.mp4"
    },
    {
        "score": 86.08,
        "start": 260.0666666666579,
        "end": 304.78333333335934,
        "video_id": "663689b8d1cd5a287c957cb2",
        "file_url": "https://scl-chessboxing.nyc3.digitaloceanspaces.com/clips/MOGUL%20CHESSBOXING%20CHAMPIONSHIP%20PRESENTED%20BY%20FANSLY%20%EF%BD%9C%20%21FANSLY%20%23FANSLYPARTNER_Fiction%20vs%20KJH_chapter_3_part_2.mp4",
        "filename": "MOGUL CHESSBOXING CHAMPIONSHIP PRESENTED BY FANSLY ｜ !FANSLY #FANSLYPARTNER_Fiction vs KJH_chapter_3_part_2.mp4"
    },
]

import uuid

input = {
    "id": uuid.uuid4(),
    "videos": video_objects,
    "audio": "Checkmate Chaos.mp3",
}

# print(input)
# process_videos(input)

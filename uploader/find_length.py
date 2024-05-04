from moviepy.editor import VideoFileClip
from glob import glob
import os

# Path to the clips directory
clips_directory = "./clips/"

# Get all mp4 files in the directory
video_files = glob(os.path.join(clips_directory, "*.mp4"))

total_duration = 0

for video_file in video_files:
    with VideoFileClip(video_file) as video:
        duration = video.duration  # Duration of the current video in seconds
        print(f"Length of '{os.path.basename(video_file)}': {duration} seconds")
        total_duration += duration

print(f"Total length of all videos: {total_duration} seconds")

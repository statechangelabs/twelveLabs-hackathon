
import os
import subprocess

def resize_video(input_path):
    """Resizes a video to 1080:1920 and saves it with '_new' appended to the filename."""
    # Split the input path to directory, filename, and extension
    dir_name, file_name = os.path.split(input_path)
    name, ext = os.path.splitext(file_name)
    
    # Define the output file path with '_new' appended before the extension
    output_path = os.path.join(dir_name, f"{name}_new{ext}")
    
    # Command to resize the video
    command = [
        'ffmpeg',
        '-i', input_path,
        "-vf", "crop=600:300",
        # "-c:v", "libx264",
        # "-crf", "23",
        # '-aspect', '9/16',
        # '-s', '1080:1920',
        # '-noautoscale',
        # '-vf', "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
        '-c:a', 'copy',  # Copy audio stream without re-encoding 
        output_path
    ]
    
    # Execute the command
    subprocess.run(command, check=True)
    print(f"Video resized and saved to: {output_path}")

# Example usage
# Assuming 'shorts/' directory contains the videos to be resized
shorts_folder = "./shorts/"
videos_to_resize = [os.path.join(shorts_folder, f) for f in os.listdir(shorts_folder) if f.endswith('.mp4')]

for video_path in videos_to_resize:
    resize_video(video_path)

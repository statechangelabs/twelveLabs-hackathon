import json
import os
import subprocess


def read_chapter_info(json_file_path):
    """Read chapters from a .info.json file. Return None if 'chapters' key is missing."""
    with open(json_file_path, "r") as file:
        data = json.load(file)
    if "chapters" in data:
        return [
            (chapter["start_time"], chapter["end_time"], chapter["title"])
            for chapter in data["chapters"]
        ]
    else:
        return None


def slice_video(video_path, start_time, end_time, output_path):
    """Slice a video from start_time to end_time."""
    cmd = [
        "ffmpeg",
        "-i",
        video_path,
        "-ss",
        str(start_time),
        "-to",
        str(end_time),
        "-c",
        "copy",
        output_path,
    ]
    subprocess.run(cmd)


def slice_chapter_into_parts(
    video_path, start_time, end_time, base_output_path, max_length=1200
):
    """Slice a chapter into smaller parts if it's longer than max_length seconds."""
    duration = end_time - start_time
    num_slices = int(duration / max_length) + (1 if duration % max_length > 0 else 0)
    for i in range(num_slices):
        new_start = start_time + i * max_length
        new_end = min(new_start + max_length, end_time)
        output_path = f"{base_output_path}_part_{i + 1}.mp4"
        slice_video(video_path, new_start, new_end, output_path)


def slice_into_parts(video_path, base_output_path, part_length=1200):
    """Slice a video into parts of part_length seconds."""
    # Use ffprobe to get the total duration of the video
    cmd = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        video_path,
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, text=True)
    total_duration = float(result.stdout)

    num_parts = int(total_duration / part_length) + (
        1 if total_duration % part_length > 0 else 0
    )
    for i in range(num_parts):
        start_time = i * part_length
        end_time = min((i + 1) * part_length, total_duration)
        output_path = f"{base_output_path}_part_{i + 1}.mp4"
        slice_video(video_path, start_time, end_time, output_path)


def main():
    downloaded_dir = "downloaded/"
    clips_dir = "clips/"
    os.makedirs(clips_dir, exist_ok=True)

    for file_name in os.listdir(downloaded_dir):
        if file_name.endswith(".info.json"):
            video_file = file_name.replace(".info.json", ".mp4")
            video_path = os.path.join(downloaded_dir, video_file)
            json_path = os.path.join(downloaded_dir, file_name)

            chapters = read_chapter_info(json_path)
            if chapters is not None:
                for i, (start, end, title) in enumerate(chapters):
                    safe_title = "".join(
                        x for x in title if x.isalnum() or x in " _-"
                    ).rstrip()
                    base_output_path = os.path.join(
                        clips_dir,
                        f"{os.path.splitext(video_file)[0]}_{safe_title}_chapter_{i + 1}",
                    )
                    slice_chapter_into_parts(video_path, start, end, base_output_path)
            else:
                # If no chapters are present, slice the video into 20-minute parts
                base_output_path = os.path.join(
                    clips_dir, os.path.splitext(video_file)[0]
                )
                slice_into_parts(video_path, base_output_path)


if __name__ == "__main__":
    main()

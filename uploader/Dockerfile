# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

RUN apt-get update

RUN apt-get install ffmpeg -y

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8080 available to the world outside this container
EXPOSE 8080


# Run clip.py when the container launches
# Run the application with gunicorn on port 8080
# CMD ["gunicorn", "-b", "0.0.0.0:8080", "unicorn:app","--log-level debug"]

# CMD ["python", "./clip.py"]

CMD ["python", "main.py"]

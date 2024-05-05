import os
from flask import Flask, request, jsonify
from clip import process_videos

app = Flask(__name__)
print("HI WE RUNNING")

@app.route("/", methods=['POST'])
def process_video():
    print("GOT TO THE ROUTE", flush=True)
    print("Request is:", request, flush=True)
    # Get JSON input from the request
    input_object = request.get_json()
    print("we probably arent here but lets see", flush=True)
    print("INPUT object is:", input_object, flush=True)
    # Call the process_videos function with the input JSON
    url = process_videos(input_object)
    print("Processed videos", flush=True)
    # Return a success response
    return jsonify({"message": "Videos processed successfully", "url": url}), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
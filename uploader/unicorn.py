import os
import json
# from flask import Flask, request, jsonify
from clip import process_videos

# app = Flask(__name__)
print("HI WE RUNNING", flush=True)

# @app.route("/", methods=['POST'])
# def app(environ, start_response):
#     print("GOT TO THE ROUTE", flush=True)
#     # print("Request is:", request)
#     # Get JSON input from the request
#     print("environ:", environ, flush=True)
#     print("start_response:", start_response, flush=True)
    
#     start_response(200)
#     return "hello"
    # input_object = request.json
    # print("INPUT object is:", input_object)
    # Call the process_videos function with the input JSON
    # process_videos(input_object)
    # Return a success response
    # return jsonify({"message": "Videos processed successfully"}), 200


def app(environ, start_response):
    print("GOT TO THE ROUTE", flush=True)
    print("environ:", environ, flush=True)

    # Reading the request body from wsgi.input
    try:
        request_body_size = int(environ.get('CONTENT_LENGTH', 0))
    except (ValueError):
        request_body_size = 0
    request_body = environ['wsgi.input'].read(request_body_size)

    print("Request body:", request_body, flush=True)

    try:
        input_object = json.loads(request_body)
        print("INPUT object is:", input_object, flush=True)
        # Now you can process the input_object as before
        # process_videos(input_object)
    except json.JSONDecodeError:
        print("Error decoding JSON", flush=True)

    # Constructing the response
    status = '200 OK'
    response_headers = [('Content-type', 'application/json')]
    start_response(status, response_headers)

    # Return the response body
    return [b'{"message": "Videos processed successfully"}']

# if __name__ == "__main__":
#     app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
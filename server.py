from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from Chrome extension

@app.route("/process", methods=["POST"])
def process_text():
    data = request.json
    text = data.get("text", "")
    process_type = "simplify"

    transformed_text = f"[SIMPLIFIED] {text}"

    return jsonify({"result": transformed_text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=True)

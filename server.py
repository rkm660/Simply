from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)


@app.route("/process", methods=["POST"])
def process_text():
    data = request.json
    text = data.get("text", "")
    process_type = "simplify"
    identifier = data.get("identifier", "unknown")  # Capture element identifier

    transformed_text = f"[SIMPLIFIED] {text}"


    print(data, text, process_type, identifier)

    return jsonify({"result": transformed_text})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)  # Use port 5001 instead of 5000

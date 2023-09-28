from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/equations', methods=['POST'])
def parse_equations():
    # Parse the file or data from the request
    data = request.get_json()

    # Do some processing here (for testing, you can skip processing)

    # Create a simple JSON response
    equations = ["equation1", "equation2", "equation3"]
    return jsonify({"equations": equations})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
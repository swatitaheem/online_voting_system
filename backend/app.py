from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

from functools import wraps

app = Flask(__name__)
CORS(app)

VOTED_USERS_FILE = 'voted_users.json'
VOTES_FILE = 'votes.json'
RESULT_STATE_FILE = 'result_state.json'
PARTIES = [
    {"id": "bjp", "name": "Bharatiya Janata Party", "work": "Digital India, Make in India"},
    {"id": "inc", "name": "Indian National Congress", "work": "RTI, MNREGA"},
    {"id": "aap", "name": "Aam Aadmi Party", "work": "Free electricity, Education reform"},
    {"id": "sp", "name": "Bahujan Samaj Party", "work": "Rural development, Infrastructure"}
]
ADMIN_CREDENTIALS = {"username": "admin", "password": "admin123"}

# Admin authentication decorator
def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or auth_header != f"Bearer {ADMIN_CREDENTIALS['username']}_{ADMIN_CREDENTIALS['password']}":
            return jsonify({"success": False, "message": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

def load_json(filename, default):
    try:
        if not os.path.exists(filename) or os.path.getsize(filename) == 0:
            save_json(filename, default)
            return default
        with open(filename, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filename}: {str(e)}")
        return default

def save_json(filename, data):
    try:
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {filename}: {str(e)}")
        return False

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        aadhaar = data.get("aadhaar")
        name = data.get("name")

        if not aadhaar or not name:
            return jsonify({
                "success": False,
                "message": "Aadhaar and name required"
            }), 400

        if not (isinstance(aadhaar, str) and aadhaar.isdigit() and len(aadhaar) == 12):
            return jsonify({
                "success": False,
                "message": "Invalid Aadhaar number format. Must be 12 digits."
            }), 400

        if not (isinstance(name, str) and 2 <= len(name) <= 50 and 
                all(c.isalpha() or c.isspace() or c in ".-'" for c in name.strip())):
            return jsonify({
                "success": False,
                "message": "Invalid name format. Must be 2-50 characters and contain only letters, spaces, and basic punctuation."
            }), 400

        voted_users = load_json(VOTED_USERS_FILE, [])
        if aadhaar in voted_users:
            return jsonify({
                "success": False,
                "message": "User has already voted"
            }), 403

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {"aadhaar": aadhaar, "name": name}
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

@app.route("/admin/login", methods=["POST"])
def admin_login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if username == ADMIN_CREDENTIALS["username"] and password == ADMIN_CREDENTIALS["password"]:
            token = f"{username}_{password}"
            return jsonify({
                "success": True,
                "message": "Admin login successful",
                "token": token
            }), 200

        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

@app.route("/results", methods=["GET"])
def results():
    try:
        # Load result visibility state
        result_state = load_json(RESULT_STATE_FILE, {"isResultPublic": False})
        votes = load_json(VOTES_FILE, {})
        total_votes = sum(votes.values())
        
        results = {
            "votes": votes,
            "total_votes": total_votes,
            "parties": PARTIES,
            "isResultPublic": result_state["isResultPublic"]
        }
        
        # If not admin request and results are not public, return limited data
        auth_header = request.headers.get('Authorization')
        is_admin = auth_header == f"Bearer {ADMIN_CREDENTIALS['username']}_{ADMIN_CREDENTIALS['password']}"
        
        if not is_admin and not result_state["isResultPublic"]:
            return jsonify({
                "success": True,
                "data": {
                    "isResultPublic": False,
                    "message": "Results have not been published yet"
                }
            }), 200

        return jsonify({
            "success": True,
            "data": results
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

@app.route("/vote", methods=["POST"])
def vote():
    try:
        data = request.get_json()
        aadhaar = data.get("aadhaar")
        party_id = data.get("party")

        # Add debug logging
        print(f"Received vote request: {data}")

        if not aadhaar or not party_id:
            return jsonify({
                "success": False,
                "message": "Missing aadhaar or party_id"
            }), 400

        # Validate data types
        if not isinstance(aadhaar, str) or not isinstance(party_id, str):
            return jsonify({
                "success": False,
                "message": "Invalid data types"
            }), 400

        voted_users = load_json(VOTED_USERS_FILE, [])
        votes = load_json(VOTES_FILE, {})

        # Ensure files exist and are writable
        if not os.path.exists(VOTED_USERS_FILE):
            open(VOTED_USERS_FILE, 'w').close()
        if not os.path.exists(VOTES_FILE):
            open(VOTES_FILE, 'w').close()

        if aadhaar in voted_users:
            return jsonify({
                "success": False,
                "message": "Already voted"
            }), 403

        if party_id not in [party["id"] for party in PARTIES]:
            return jsonify({
                "success": False,
                "message": f"Invalid party ID: {party_id}"
            }), 400

        votes[party_id] = votes.get(party_id, 0) + 1
        voted_users.append(aadhaar)

        if save_json(VOTED_USERS_FILE, voted_users) and save_json(VOTES_FILE, votes):
            return jsonify({
                "success": True,
                "message": "Vote recorded successfully"
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Error saving vote data"
            }), 500

    except Exception as e:
        print(f"Error processing vote: {str(e)}")  # Add server-side logging
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

@app.route("/parties", methods=["GET"])
def get_parties():
    return jsonify({
        "success": True,
        "data": PARTIES
    }), 200

@app.route("/admin/toggle-result", methods=["POST"])
def toggle_result():
    try:
        data = request.get_json()
        is_result_public = data.get("isResultPublic")
        
        if is_result_public is None:
            return jsonify({
                "success": False,
                "message": "isResultPublic parameter is required"
            }), 400

        result_state = {"isResultPublic": is_result_public}
        if save_json(RESULT_STATE_FILE, result_state):
            return jsonify({
                "success": True,
                "message": f"Results {'published' if is_result_public else 'hidden'} successfully",
                "data": {"isResultPublic": is_result_public}
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Error saving result state"
            }), 500

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

if __name__ == "__main__":
    # Initialize JSON files
    load_json(VOTED_USERS_FILE, [])
    load_json(VOTES_FILE, {})
    load_json(RESULT_STATE_FILE, {"isResultPublic": False})
    app.run(debug=True)

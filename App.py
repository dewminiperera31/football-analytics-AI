
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import bcrypt
import jwt
import datetime
import requests
import pickle
import pandas as pd
from pymongo import MongoClient
from bson.objectid import ObjectId
import numpy as np
from functools import wraps



# ===================== App Config =====================
app = Flask(__name__)
CORS(app)

JWT_SECRET = "supersecretkey"
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 3600  # 1 hour
DATA_PATH = os.path.join(os.path.dirname(__file__), "mock_data")

client = MongoClient("mongodb+srv://supun00wick:Supunwick!@football.wyr5jhl.mongodb.net/?retryWrites=true&w=majority")
db = client["Football"]
users_collection = db["users"]
players_collection = db["Players"]


# ===================== Load ML Model =====================
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "model.pkl")
loaded_model = None
prediction_labels = {0: "Draw", 1: "Loss", 2: "Win"}

if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, "rb") as f:
        loaded_model = pickle.load(f)
else:
    print("⚠️ Warning: ML model file not found at", MODEL_PATH)


PLAYER_MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "player_performance_model.pkl")
with open(PLAYER_MODEL_PATH, "rb") as f:
    player_model = pickle.load(f)

# Map numeric classes to labels
PLAYER_CLASS_MAP = {1: "Good", 2: "Avarage"}

# ===================== Utilities =====================
def load_json(filename):
    """Load data from JSON file in mock_data folder."""
    file_path = os.path.join(DATA_PATH, filename)
    if not os.path.exists(file_path):
        return []
    with open(file_path, "r") as f:
        return json.load(f)

def save_json(filename, data):
    """Save data into JSON file in mock_data folder."""
    file_path = os.path.join(DATA_PATH, filename)
    os.makedirs(DATA_PATH, exist_ok=True)
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)



# ===================== Data Routes =====================
@app.route("/matches")
def matches():
    return jsonify(load_json("matches.json"))

@app.route("/matches/<int:id>")
def match_detail(id):
    matches = load_json("matches.json")
    match = next((m for m in matches if m["id"] == id), None)
    return jsonify(match) if match else (jsonify({"error": "Match not found"}), 404)

@app.route("/players")
def players():
    return jsonify(load_json("players.json"))

@app.route("/players/<int:id>")
def player_detail(id):
    players = load_json("players.json")
    player = next((p for p in players if p["id"] == id), None)
    return jsonify(player) if player else (jsonify({"error": "Player not found"}), 404)

@app.route("/teams")
def teams():
    return jsonify(load_json("teams.json"))

@app.route("/teams/<int:id>")
def team_detail(id):
    teams = load_json("teams.json")
    team = next((t for t in teams if t["id"] == id), None)
    return jsonify(team) if team else (jsonify({"error": "Team not found"}), 404)

@app.route("/stats")
def stats():
    return jsonify(load_json("stats.json"))

@app.route("/predictions")
def predictions():
    return jsonify(load_json("predictions.json"))

# ===================== ML Prediction Route =====================
# Load cleaned datasets
# Load CSVs
matches_df = pd.read_csv("models/cleaned_match_data.csv")
fifa_df = pd.read_csv("models/cleaned_fifa_data.csv")

# Load trained model
with open("models/model.pkl", "rb") as f:
    loaded_model = pickle.load(f)

# Helper: calculate average team rating
def team_rating(team_id):
    players = fifa_df[fifa_df["club_team_id"] == team_id]
    if players.empty:
        return 70  # default if no data
    return players["overall"].mean()

# Helper: recent form (last 5 matches)
def recent_form(team_id):
    last5 = matches_df[(matches_df['home_team_api_id']==team_id) | 
                       (matches_df['away_team_api_id']==team_id)].tail(5)
    if last5.empty: 
        return 0.5
    wins = sum((last5['home_team_api_id']==team_id) & (last5['result']==1)) + \
           sum((last5['away_team_api_id']==team_id) & (last5['result']==0))
    return wins / 5


@app.route("/predict-csv-match", methods=["GET"])
def predict_csv_match():
    try:
        home_team_id = int(request.args.get("home_team_id"))
        away_team_id = int(request.args.get("away_team_id"))

        # Features
        features = [
            team_rating(home_team_id),      # home_attack
            team_rating(home_team_id),      # home_defense
            team_rating(away_team_id),      # away_attack
            team_rating(away_team_id),      # away_defense
            recent_form(home_team_id),      # home_form
            recent_form(away_team_id),      # away_form
            1                               # importance (default)
        ]

        if not loaded_model:
            return jsonify({"error": "Model not loaded"}), 500

        X = np.array([features])
        probs = loaded_model.predict_proba(X)[0]
        prediction = int(loaded_model.predict(X)[0])

        # Map class to label 
        class_labels = {0: "Home Win", 1: "Away Win"}  # or {0:"Draw",1:"Win"} depending on training

        return jsonify({
            "predicted_label": class_labels.get(prediction, "TBD"),
            "confidence_percent": round(max(probs)*100, 1),
            "probabilities": {
                "home_win": round(probs[0]*100,1),
                "away_win": round(probs[1]*100,1)
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ===================== News API =====================
NEWS_API_KEY = "8424ff682d174b2fa562b99130b2582c"
@app.route("/news")
def news():
    page = request.args.get("page", 1)
    try:
        # Fetch articles from specified sources
        response = requests.get(
            "https://newsapi.org/v2/everything",
            params={
                "q": "Football",
                "language": "en",
                "pageSize": 50,  # fetch more to filter
                "page": page,
                "sortBy": "publishedAt",
                "sources": "espn,bbc-sport,sky-sports,goal.com",
                "apiKey": NEWS_API_KEY
            }
        )
        data = response.json()
        
        # Keywords to include (soccer/European football)
        include_keywords = [
            "soccer", "football (soccer)", "Premier League", "Champions League",
            "La Liga", "FIFA", "UEFA", "Serie A", "Bundesliga"
        ]
        # Keywords to exclude (American football)
        exclude_keywords = ["NFL", "American football", "Super Bowl", "college football"]

        filtered_articles = []
        for article in data.get("articles", []):
            title = article.get("title", "").lower()
            description = article.get("description", "").lower()
            
            # Include if matches include_keywords and does NOT match exclude_keywords
            if (any(k.lower() in title or k.lower() in description for k in include_keywords) and
                not any(k.lower() in title or k.lower() in description for k in exclude_keywords)):
                filtered_articles.append(article)
        
        # Return top 10 filtered articles
        data["articles"] = filtered_articles[:10]
        return jsonify(data)
    
    except Exception as e:
        return jsonify({"error": "Failed to fetch news", "details": str(e)}), 500






# ===================== Live Scores =====================
LIVE_SCORES_API_KEY = "f00f8a38bc6b47758daa22270c314217"

@app.route("/live-scores")
def live_scores():
    try:
        response = requests.get(
            "https://api.football-data.org/v4/matches",
            headers={"X-Auth-Token": LIVE_SCORES_API_KEY},
            timeout=10 
        )
        response.raise_for_status()  # raises an HTTPError if the response code was unsuccessful
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch live scores", "details": str(e)}), 500


@app.route("/upcoming")
def upcoming():
    try:
        response = requests.get(
            "https://api.football-data.org/v4/competitions/CL/matches",
            headers={"X-Auth-Token": LIVE_SCORES_API_KEY},
            timeout=10  # optional, avoids hanging requests
        )
        response.raise_for_status()  # raises an HTTPError if the response code was unsuccessful
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch upcoming Macthes", "details": str(e)}), 500


@app.route("/Standings")
def Standings():
    try:
        response = requests.get(
            "https://api.football-data.org/v4/competitions/PL/standings",
            headers={"X-Auth-Token": LIVE_SCORES_API_KEY},
            timeout=10 
        )
        response.raise_for_status()  # raises an HTTPError if the response code was unsuccessful
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch PL standings", "details": str(e)}), 500

@app.route("/Laliga-Standings")
def LaligaStandings():
    try:
        response = requests.get(
            "https://api.football-data.org/v4/competitions/PD/standings",
            headers={"X-Auth-Token": LIVE_SCORES_API_KEY},
            timeout=10  # optional, avoids hanging requests
        )
        response.raise_for_status()  # raises an HTTPError if the response code was unsuccessful
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch Laliga Standings", "details": str(e)}), 500

@app.route("/SAStandings")
def SAStandings():
    try:
        response = requests.get(
            "https://api.football-data.org/v4/competitions/SA/standings",
            headers={"X-Auth-Token": LIVE_SCORES_API_KEY},
            timeout=10  # optional, avoids hanging requests
        )
        response.raise_for_status()  # raises an HTTPError if the response code was unsuccessful
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch Serie A standings", "details": str(e)}), 500

@app.route("/FL1Standings")
def FL1Standings():
    try:
        response = requests.get(
            "https://api.football-data.org/v4/competitions/FL1/standings",
            headers={"X-Auth-Token": LIVE_SCORES_API_KEY},
            timeout=10  # optional, avoids hanging requests
        )
        response.raise_for_status()  # raises an HTTPError if the response code was unsuccessful
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch league 1 standings", "details": str(e)}), 500

@app.route("/Teams")
def Teams():
    try:
        response = requests.get(
            "https://api.football-data.org/v4/teams",
            headers={"X-Auth-Token": LIVE_SCORES_API_KEY},
            timeout=10  # optional, avoids hanging requests
        )
        response.raise_for_status()  # raises an HTTPError if the response code was unsuccessful
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to teams", "details": str(e)}), 500


@app.route("/Games")
def Games():
    try:
        response = requests.get(
            "https://api.football-data.org//v4/matches/1/head2head ",
            headers={"X-Auth-Token": LIVE_SCORES_API_KEY},
            timeout=10  # optional, avoids hanging requests
        )
        response.raise_for_status()  # raises an HTTPError if the response code was unsuccessful
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch players", "details": str(e)}), 500


# ===================== Player preformance Prediction Route =====================

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "player_performance_model.pkl")
with open(MODEL_PATH, "rb") as f:
    player_model = pickle.load(f)

@app.route("/predict-player", methods=["POST"])
def predict_player():
    data = request.json or {}
    features = data.get("features")
    
    if not features:
        return jsonify({"error": "Missing 'features' in request"}), 400
    
    if len(features) != 9:   # <- enforce 9 features
        return jsonify({"error": f"Expected 9 features, got {len(features)}"}), 400

    X = np.array([features])
    prediction = player_model.predict(X)[0]
    probs = player_model.predict_proba(X)[0].tolist() if hasattr(player_model, "predict_proba") else None

    return jsonify({"prediction": int(prediction), "probabilities": probs})


# ---------------- Register User ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    user = {
        "email": email,
        "password": hashed_pw.decode(),
        "role": "user"
    }
    result = users_collection.insert_one(user)

    return jsonify({"message": "✅ User registered!", "user_id": str(result.inserted_id)}), 201

# ---------------- Get All Users ----------------
@app.route("/users")
def get_users():
    users = list(users_collection.find({}, {"password": 0}))  # hide password
    for u in users:
        u["_id"] = str(u["_id"])
    return jsonify(users)


@app.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    users_collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "User deleted"})


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    # Find user in MongoDB
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Check password
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate JWT
    token = jwt.encode(
        {
            "user_id": str(user["_id"]),
            "role": user.get("role", "user"),  # default role: user
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        },
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )

    return jsonify({
        "token": token,
        "role": user.get("role", "user")
    }), 200

from flask import request, jsonify
import bcrypt

@app.route("/create-user", methods=["POST"])
def create_user():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        email = data.get("email")
        username = data.get("username")
        password = data.get("password")
        role = data.get("role", "user")  # default to "user"

        if not email or not username or not password or not role:
            return jsonify({"error": "All fields are required"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "Email already exists"}), 400

        hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

        user = {
            "email": email,
            "username": username,
            "password": hashed_pw.decode(),
            "role": role
        }
        result = users_collection.insert_one(user)

        return jsonify({"message": "✅ User created!", "user_id": str(result.inserted_id)}), 201

    except Exception as e:
        print("Error in create_user:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/add-player", methods=["POST"])
def add_player():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        name = data.get("name")
        position = data.get("position")
        team = data.get("team")
        age = data.get("age")

        if not name or not position or not team or not age:
            return jsonify({"error": "All fields are required"}), 400

        # Insert into players collection
        player = {
            "name": name,
            "position": position,
            "team": team,
            "age": int(age)  # store as integer
        }
        result = players_collection.insert_one(player)

        return jsonify({
            "message": "✅ Player added successfully!",
            "player_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        print("Error in add_player:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/Players", methods=["GET"])
def get_players():
    try:
        Players = list(players_collection.find({}))
        for p in Players:
            p["_id"] = str(p["_id"])  # make JSON serializable
        return jsonify(Players), 200
    except Exception as e:
        print("Error in get_players:", e)
        return jsonify({"error": str(e)}), 500
 

# ✅ Delete a player by ID
@app.route("/players/<id>", methods=["DELETE"])
def delete_player(id):
    try:
        result = players_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Player not found"}), 404
        return jsonify({"message": "✅ Player deleted"}), 200
    except Exception as e:
        print("Error in delete_player:", e)
        return jsonify({"error": str(e)}), 500

       
# ===================== Start Server =====================
if __name__ == "__main__":
    app.run(port=5000, debug=True)
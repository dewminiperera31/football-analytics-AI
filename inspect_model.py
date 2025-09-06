

import pickle
import pandas as pd

# Load model
with open("models/model.pkl", "rb") as f:
    model = pickle.load(f)

print("✅ Model loaded")
print("➡️ Model type:", type(model))

# Inspect model attributes
if hasattr(model, "n_features_in_"):
    print("➡️ Expected features:", model.n_features_in_)
if hasattr(model, "feature_names_in_"):
    print("➡️ Feature names:", model.feature_names_in_)
if hasattr(model, "classes_"):
    print("➡️ Classes:", model.classes_)

# Load cleaned datasets
fifa_df = pd.read_csv("models/cleaned_fifa_data.csv", nrows=5)
match_df = pd.read_csv("models/cleaned_match_data.csv", nrows=5)

print("\n📊 Cleaned FIFA Data Columns:", fifa_df.columns.tolist())
print("📊 Cleaned Match Data Columns:", match_df.columns.tolist())

import pickle


print("✅ Model type:", type(model))
if hasattr(model, "n_features_in_"):
    print("➡️ Expected features:", model.n_features_in_)
if hasattr(model, "feature_names_in_"):
    print("➡️ Feature names:", model.feature_names_in_)
if hasattr(model, "classes_"):
    print("➡️ Classes:", model.classes_)

    df = pd.read_csv("models/cleaned_match_data.csv")
print(df.describe())

LIVE_SCORES_API_KEY = "f00f8a38bc6b47758daa22270c314217"

@app.route("/predict-match/<int:match_id>", methods=["GET"])
def predict_match(match_id):
    try:
        # 1️⃣ Fetch match details from API
        response = requests.get(
            f"https://api.football-data.org/v4/matches/{match_id}",
            headers={"X-Auth-Token": LIVE_SCORES_API_KEY},
            timeout=10
        )
        response.raise_for_status()
        match_data = response.json().get("match") or response.json()

        home_team = match_data["homeTeam"]["name"]
        away_team = match_data["awayTeam"]["name"]

        # 2️⃣ Extract features (⚠️ placeholders, you must replace with real engineered features)
        features = [
            match_data.get("home_attack", 70),   # placeholder
            match_data.get("home_defense", 65),  # placeholder
            match_data.get("away_attack", 68),   # placeholder
            match_data.get("away_defense", 60),  # placeholder
            match_data.get("home_form", 0.7),    # placeholder
            match_data.get("away_form", 0.6),    # placeholder
            match_data.get("importance", 1)      # placeholder
        ]

        if not loaded_model:
            return jsonify({"error": "Model not loaded"}), 500

        if len(features) != loaded_model.n_features_in_:
            return jsonify({
                "error": f"Feature mismatch: expected {loaded_model.n_features_in_}, got {len(features)}"
            }), 400

        X = np.array([features])
        probs = loaded_model.predict_proba(X)[0]
        prediction = int(loaded_model.predict(X)[0])

        return jsonify({
            "home_team": home_team,
            "away_team": away_team,
            "prediction": prediction,
            "probabilities": probs.tolist()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



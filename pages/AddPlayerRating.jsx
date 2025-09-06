import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./../styles/AddPlayerRating.css";

const AddPlayerRating = () => {
  const location = useLocation();
  const player = location.state?.player; // 👈 get player from navigation

  

  // Feature names
  const featureNames = [
    "Goals Scored",
    "Assists",
    "Shots on Target",
    "Pass Accuracy (%)",
    "Tackles",
    "Interceptions",
    "Dribbles",
    "Fouls Committed",
    "Minutes Played"
  ];

  const [features, setFeatures] = useState(Array(featureNames.length).fill(""));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  

  // Map predicted class to meaningful label
  const classLabels = {
    1: "Poor",
    2: "Average",
    3: "Good",
    4: "Excellent"
  };

  const handleChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const numericFeatures = features.map((f) => parseFloat(f));
    if (numericFeatures.some(isNaN)) {
      setError("All features must be numbers.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/predict-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: numericFeatures }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Prediction failed");
      }
    } catch (err) {
      setError("Server error");
      console.error(err);
    }
  };

  return (
    <div className="player-rating-container">
      <h2>Player Rating Prediction Based on Previous Game</h2>

      {player && (
        <div className="selected-player">
          <h3>{player.name}</h3>
          <p>{player.position} | {player.team}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="features-form">
        {features.map((val, idx) => (
          <div key={idx} className="feature-input">
            <label>{featureNames[idx]}</label>
            <input
              type="number"
              placeholder={featureNames[idx]}
              value={val}
              onChange={(e) => handleChange(idx, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Predict Player Performance</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="prediction-result">
          <h3>Prediction Result</h3>
          <p>Predicted Rating : {classLabels[result.prediction] || result.prediction}</p>
          <p>
            Probabilities:{" "}
            {result.probabilities
              .map((p, i) => `${classLabels[i + 1] || i + 1}: ${p.toFixed(2)}`)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddPlayerRating;

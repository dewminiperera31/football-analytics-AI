import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MatchDetails.css';

const MatchDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const match = location.state?.match;

  const [prediction, setPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [error, setError] = useState("");

  if (!match) return <p>No match data available</p>;

  const homeCrest = match.homeTeam?.crest || `https://crests.football-data.org/${match.homeTeam?.id}.png`;
  const awayCrest = match.awayTeam?.crest || `https://crests.football-data.org/${match.awayTeam?.id}.png`;

  // Fetch prediction from CSV-based Flask route
  const fetchPrediction = async () => {
    try {
      setLoadingPrediction(true);
      setError("");
      const res = await axios.get(
        `http://localhost:5000/predict-csv-match?home_team_id=${match.homeTeam.id}&away_team_id=${match.awayTeam.id}`
      );
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch prediction.");
    } finally {
      setLoadingPrediction(false);
    }
  };

  return (
    <div className="match-details-page">
      <button onClick={() => navigate(-1)} className="back-btn">Back</button>

      <h2 className="match-title">{match.homeTeam?.name} vs {match.awayTeam?.name}</h2>

      <div className="match-info">
        {/* Teams & Scores */}
        <div className="teams-score">
          <div className="team">
            <img src={homeCrest} alt={match.homeTeam?.name} className="team-logo" />
            <span>{match.homeTeam?.name}</span>
          </div>

          <div className="score">
            <span>{match.score?.fullTime?.home ?? '-'}</span>
            <strong>:</strong>
            <span>{match.score?.fullTime?.away ?? '-'}</span>
          </div>

          <div className="team">
            <img src={awayCrest} alt={match.awayTeam?.name} className="team-logo" />
            <span>{match.awayTeam?.name}</span>
          </div>
        </div>

        {/* Match Details */}
        <div className="match-details">
          <p><strong>Competition:</strong> {match.competition?.name}</p>
          <p><strong>Matchday:</strong> {match.matchday}</p>
          <p><strong>Stage:</strong> {match.stage}</p>
          <p><strong>Status:</strong> {match.status}</p>
          <p><strong>Date:</strong> {new Date(match.utcDate).toLocaleString()}</p>

          {/* Prediction Button */}
          <button onClick={fetchPrediction} className="prediction-btn">
            {loadingPrediction ? "Predicting..." : "Predict Match Result"}
          </button>

          {/* Show prediction */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {prediction && (
            <div className="prediction-result">
              <h3>Predicted Winner: {prediction.predicted_label}</h3>
              <p>Confidence: {prediction.confidence_percent}%</p>
              <ul>
                <li>🏠 Home Win: {prediction.probabilities.home_win}%</li>
                <li>🤝 Draw: {prediction.probabilities.draw ?? 0}%</li>
                <li>🚀 Away Win: {prediction.probabilities.away_win}%</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;

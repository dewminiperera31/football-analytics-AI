import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Predictions.css';

const Predictions = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const match = location.state?.match;

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/predict/${id}`);
        setPrediction(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch prediction.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [id]);

  if (!match) return <p>No match data found.</p>;
  if (loading) return <p>Loading prediction...</p>;
  if (error) return <p>{error}</p>;

  // Predicted winner
  const predictedWinner = prediction.predicted_label || "TBD";

  const homeCrest = match.homeTeam?.crest || `https://crests.football-data.org/${match.homeTeam?.id}.svg`;
  const awayCrest = match.awayTeam?.crest || `https://crests.football-data.org/${match.awayTeam?.id}.svg`;

  return (
    <div className="prediction-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h2>Match Prediction</h2>

      <div className="teams-stats">
        {/* Home Team */}
        <div className="team-card">
          <img 
            src={homeCrest} 
            alt={match.homeTeam?.name} 
            className="team-logo" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/50?text=Logo";
            }}
          />
          <h3>{match.homeTeam?.name}</h3>
          <p>Rating: {match.homeTeam?.rating ?? '-'}</p>
          <p>Recent Form: {match.home_recent_winrate ?? '-'}</p>
        </div>

        <div className="vs">VS</div>

        {/* Away Team */}
        <div className="team-card">
          <img 
            src={awayCrest} 
            alt={match.awayTeam?.name} 
            className="team-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/50?text=Logo";
            }}
          />
          <h3>{match.awayTeam?.name}</h3>
          <p>Rating: {match.awayTeam?.rating ?? '-'}</p>
          <p>Recent Form: {match.away_recent_winrate ?? '-'}</p>
        </div>
      </div>

      {/* Predicted Winner */}
      <div className="predicted-winner">
        <h3>Predicted Winner:</h3>
        <p className={`winner-label ${predictedWinner.toLowerCase().replace(' ', '-')}`}>
          {predictedWinner}
        </p>
        <h4>Confidence:</h4>
        <p>{prediction.confidence_percent?.toFixed(1) ?? 0}%</p>
      </div>

      {/* Probability Breakdown */}
      <div className="probabilities">
        <h4>Probability Breakdown:</h4>
        <ul>
          <li>🏠 Home Win: {prediction.probabilities?.home_win?.toFixed(1) ?? 0}%</li>
          <li>🤝 Draw: {prediction.probabilities?.draw?.toFixed(1) ?? 0}%</li>
          <li>🚀 Away Win: {prediction.probabilities?.away_win?.toFixed(1) ?? 0}%</li>
        </ul>
      </div>
    </div>
  );
};

export default Predictions;

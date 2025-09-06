import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Players.css";

function Players() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch players from backend
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Players");
        setPlayers(res.data);
      } catch (err) {
        console.error("Error fetching players:", err);
        setError("❌ Failed to load players");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handlePredict = (player) => {
    // Pass player info to rating page
    navigate("/player-rating", { state: { player } });
  };

  if (loading) return <p>⏳ Loading players...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="players-container">
      <h1 className="players-heading">Player Performance</h1>
      <p className="players-description">
        Click on a player to view predict Performance ratings Based on Last match perfomance.
      </p>

      <div className="players-grid">
        {players.length === 0 ? (
          <p>No players found.</p>
        ) : (
          players.map((player) => (
            <div key={player._id} className="player-card">
              <Link to={`/players/${player._id}`} className="player-info">
                <h2>{player.name}</h2>
                <p>{player.position}</p>
                <p>Team: {player.team}</p>
              </Link>

              {/* 🚀 Predict Rating Button */}
              <button
                className="predict-btn"
                onClick={() => handlePredict(player)}
              >
                🎯 Predict Performance Rating
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Players;

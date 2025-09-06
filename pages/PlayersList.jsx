// src/pages/PlayersList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PlayersList.css";

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPlayers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Players"); // ✅ lowercase route
      setPlayers(res.data);
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("❌ Failed to load players");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/Players/${id}`);
      if (res.status === 200) {
        setSuccess("✅ Player deleted successfully!");
        setPlayers(players.filter((p) => p._id !== id)); // remove from state
      }
    } catch (err) {
      console.error("Error deleting player:", err);
      setError("❌ Failed to delete player");
    }
  };

  if (loading) return <p>⏳ Loading players...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="players-list-container">
      <h2>Players List</h2>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <table className="players-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Team</th>
              <th>Age</th>
              <th>Actions</th> {/* ✅ Added column */}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td>{player.position}</td>
                <td>{player.team}</td>
                <td>{player.age}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(player._id)}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlayersList;

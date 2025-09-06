// src/pages/AddPlayer.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/AddPlayer.css";

const AddPlayer = () => {
  const [player, setPlayer] = useState({
    name: "",
    position: "",
    team: "",
    age: ""
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/add-player", player, {
        headers: { "Content-Type": "application/json" }
      });

      if (res.status === 201) {
        setSuccess(res.data.message || "✅ Player added successfully!");
        setPlayer({ name: "", position: "", team: "", age: "" });
      } else {
        setError(res.data.error || "❌ Failed to add player");
      }
    } catch (err) {
      console.error("Add player error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "❌ Failed to add player");
    }
  };

  return (
    <div className="add-player-container">
      <h2>Add Player</h2>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="add-player-form">


        
        <input
          type="text"
          name="name"
          placeholder="Player Name"
          value={player.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={player.position}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="team"
          placeholder="Team"
          value={player.team}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={player.age}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Player</button>
      </form>
    </div>
  );
};

export default AddPlayer;

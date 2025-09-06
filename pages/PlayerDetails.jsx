// src/pages/PlayerDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PlayerDetails.css';
import axios from 'axios';

function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/player/${id}`)  // 🔁 Update backend route
      .then(res => setPlayer(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!player) return <p>Loading...</p>;

  return (
    <div className="player-detail">
      <h1>{player.name}</h1>
      <p><strong>Team:</strong> {player.team}</p>
      <p><strong>Position:</strong> {player.position}</p>

      <h3>Performance Metrics</h3>
      <ul>
        <li>Overall Rating: {player.overall_rating}</li>
        <li>Agility: {player.agility}</li>
        <li>Vision: {player.vision}</li>
        <li>Ball Control: {player.ball_control}</li>
      </ul>
    </div>
  );
}

export default PlayerDetail;

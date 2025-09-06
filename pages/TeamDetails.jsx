// src/pages/TeamDetails.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/TeamDetails.css';

function TeamDetails() {
  const { teamId } = useParams();

  // Placeholder for now — you can fetch actual team data using the teamId
  return (
    <div className="team-details-container">
      <h1>Team #{teamId} Insights</h1>
      <p>Detailed formations, player stats, possession zones, xG charts, and more.</p>

      {/* Placeholder components */}
      <div className="team-section">
        <h2>Formation</h2>
        <p>4-3-3</p>
      </div>
      <div className="team-section">
        <h2>xG Trend</h2>
        <p>Match-by-match expected goals trend line here</p>
      </div>
      <div className="team-section">
        <h2>Possession Heatmap</h2>
        <p>[Heatmap Visualization Placeholder]</p>
      </div>
    </div>
  );
}

export default TeamDetails;

// src/pages/CoachDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

export default function CoachDashboard() {
  return (
    <div className="dashboard-container">
      <h1>🏋️ Coach Dashboard</h1>
      <p>Manage players, training, and matches.</p>

      <div className="dashboard-links">
        <Link to="/players">View Players</Link>
        <Link to="/match">View Matches</Link>
      </div>
    </div>
  );
}

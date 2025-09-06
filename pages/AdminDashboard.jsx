// src/pages/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css"; // optional CSS

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <h1>⚙️ Admin Dashboard</h1>
      <p>Manage users, matches, and system settings.</p>

      <div className="dashboard-links">
        <Link to="/add-user">Add User</Link>
        <Link to="/match">Manage Matches</Link>
        <Link to="/teams">Manage Teams</Link>
      </div>
    </div>
  );
}

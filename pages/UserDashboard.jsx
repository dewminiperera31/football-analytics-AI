// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

export default function UserDashboard() {
  const email = localStorage.getItem("user_email") || "User";

  // ✅ success message state
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    // hide after 3 seconds
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  return (
    <div className="dashboard-container">
      <h1>🎯 User Dashboard</h1>

      {/* ✅ temporary login success message */}
      {showMessage && (
        <div className="success-message">
          ✅ Login successful! Welcome {email}.
        </div>
      )}

      <p>Hi, Welcome Back again!!</p>
      <p>View matches, teams, players, and predictions.</p>

      <div className="dashboard-links">
        <Link to="/">Home</Link>
        <Link to="/match">Live Matches</Link>
      </div>
    </div>
  );
}

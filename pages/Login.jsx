import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState(""); // use email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // match backend
      });
      const data = await res.json();

      if (res.ok) {
        // store user info locally
        localStorage.setItem("email", email); 
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);

        // role-based navigation
        if (data.role === "admin") navigate("/admin-dashboard");
        else if (data.role === "coach") navigate("/coach-dashboard");
        else navigate("/user-dashboard");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Server error");
      console.error(err);
    }
  };

  const continueAsGuest = () => {
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="login-container">
      <div className="login-welcome">
        <h2>Welcome to ⚽ SoccerLive</h2>
        <p>Please login or continue as a guest</p>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        {error && <p className="login-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <button className="guest-btn" onClick={continueAsGuest}>
        Continue as Guest
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const email = localStorage.getItem("email"); // ← changed here
    const role = localStorage.getItem("role");
    if (email && role) setUser({ email, role });
    else setUser(null);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("email"); // ← changed here
    localStorage.removeItem("role");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="header">
      <h1>⚽ SoccerLive</h1>
      <div className="header-right">
        {user ? (
          <div className="user-info">
            <span style={{ fontSize: "24px" }}>👤</span>
            <span>Hi, {user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

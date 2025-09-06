// src/components/AdminNavbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import '../styles/AdminNavbar.css'; 

const AdminNavbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">Admin Panel</div>
      <div className="navbar-links">
        <NavLink to="/admin-dashboard">Dashboard</NavLink>
        <NavLink to="/add-user">Add User</NavLink>
        <NavLink to="/manage-users">Manage Users</NavLink>
        <NavLink to="/add-player">Add Players</NavLink>
        <NavLink to="/players-list">Players List</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
    </nav>
  );
};

export default AdminNavbar;

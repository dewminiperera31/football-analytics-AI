import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">Menu</h2>

      <div className="navbar-links">
        <Link to="/">🏠 Home</Link>
        <Link to="/match">📊 Live Scores & Fixtures</Link>
        <Link to="/standings"> 📊 Standings & Tables</Link>
        <Link to="/teams">👥 All Teams</Link>
        <Link to="/players">⚽ Player Analysis</Link>
        <Link to="/about">ℹ️ About</Link>
      </div>
    </nav>
  );
};

export default Navbar;

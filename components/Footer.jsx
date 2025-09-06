import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-about">
          <h3>Football Analytics</h3>
          <p>Real-time insights, player ratings, match predictions, and more.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/matches">Matches</a></li>
            <li><a href="/players">Players</a></li>
            <li><a href="/teams">Teams</a></li>
            <li><a href="/news">News</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: support@footballanalytics.com</p>
          <p>Phone: +94 123 456 789</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Football Analytics · All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;

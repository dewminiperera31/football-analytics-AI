import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Teams.css';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch teams from backend API
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/Teams'); 
      setTeams(response.data.teams || []);
    } catch (err) {
      console.error('Error fetching teams:', err.message);
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) return <p className="loading">Loading teams...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="teams-container">
      <h1 className="teams-heading">Team Insights</h1>
      <p className="teams-description">
        Explore team stats, venues, and official websites.
      </p>

      <div className="teams-grid">
        {teams.map((team) => (
          <Link to={`/teams/${team.id}`} className="team-card" key={team.id}>
            <img
              src={team.crest || 'https://via.placeholder.com/80?text=Logo'}
              alt={team.name}
              className="team-logo"
            />
            <h2>{team.name}</h2>
            <p>Founded: {team.founded}</p>
            <p>Venue: {team.venue}</p>
            <a
              href={team.website}
              target="_blank"
              rel="noopener noreferrer"
              className="team-website"
            >
              Official Website
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Teams;

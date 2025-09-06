import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Match.css';

const Match = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch live matches from Flask backend
  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/live-scores');
      setMatches(response.data.matches || []);
    } catch (error) {
      console.error('Error fetching live matches:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  const handleMatchClick = (match) => {
    navigate(`/match/${match.id}`, { state: { match } });
  };

  return (
    <div className="match-page">
      
      {/* Navigate to Upcoming Matches */}
      <div className="upcoming-btn-container">
        <button
          className="upcoming-btn"
          onClick={() => navigate('/upcoming')}
        >
          View Upcoming Fixtures
        </button>
      </div>
      <h2 className="match-title">Today Matches</h2>

      

      {loading && <p className="loading">Loading live matches...</p>}

      {!loading && matches.length === 0 ? (
        <p className="no-match">No live matches at the moment</p>
      ) : (
        <div className="match-grid">
          {matches.map((match) => {
            const homeTeamId = match.homeTeam?.id;
            const awayTeamId = match.awayTeam?.id;

            const homeCrest =
              match.homeTeam?.crest || `https://crests.football-data.org/${homeTeamId}.svg`;
            const awayCrest =
              match.awayTeam?.crest || `https://crests.football-data.org/${awayTeamId}.svg`;

            return (
              <div
                key={match.id}
                className="match-card"
                onClick={() => handleMatchClick(match)}
              >
                <div className="teams">
                  {/* Home Team */}
                  <div className="team">
                    <img
                      src={homeCrest}
                      alt={match.homeTeam?.name || 'Home'}
                      className="team-logo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/50?text=Logo';
                      }}
                    />
                    <span>{match.homeTeam?.name || 'TBD'}</span>
                  </div>

                  {/* Score */}
                  <div className="score">
                    <span>{match.score?.fullTime?.home ?? '-'}</span>
                    <strong>:</strong>
                    <span>{match.score?.fullTime?.away ?? '-'}</span>
                  </div>

                  {/* Away Team */}
                  <div className="team">
                    <img
                      src={awayCrest}
                      alt={match.awayTeam?.name || 'Away'}
                      className="team-logo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/50?text=Logo';
                      }}
                    />
                    <span>{match.awayTeam?.name || 'TBD'}</span>
                  </div>
                </div>

                {/* Match Status */}
                <div className={`match-status ${match.status?.toLowerCase() || ''}`}>
                  {match.status || 'Unknown'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Refresh */}
      <div className="refresh-container">
        <button onClick={fetchLiveMatches} className="refresh-btn" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Live Matches'}
        </button>
      </div>


    </div>

    

    
  );
};

export default Match;

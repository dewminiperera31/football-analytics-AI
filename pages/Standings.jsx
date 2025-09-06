import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Standings.css";

const Standings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState("PL"); // default = Premier League

  // Map leagues to backend endpoints
  const leagueEndpoints = {
    PL: "http://localhost:5000/Standings",        // Premier League
    PD: "http://localhost:5000/Laliga-Standings",    // La Liga
    SA: "http://localhost:5000/SAStandingss",    // CL
    FL1: "http://localhost:5000/FL1Standings",   // Ligue 1
  };

  const fetchStandings = async (leagueCode) => {
    try {
      setLoading(true);
      const response = await axios.get(leagueEndpoints[leagueCode]);
      const table = response.data.standings?.[0]?.table || [];
      setStandings(table);
    } catch (error) {
      console.error("Error fetching standings:", error.message);
      setStandings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dropdown changes
  useEffect(() => {
    fetchStandings(selectedLeague);
  }, [selectedLeague]);

  return (
    <div className="standings-page">
      <div className="standings-header">
        <h2>League Standings</h2>

        {/* Dropdown for league selection */}
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="league-dropdown"
        >
          <option value="PL">Premier League</option>
          <option value="PD">La Liga</option>
          <option value="SA">Serie A</option>
          <option value="FL1">Ligue 1</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading standings...</p>
      ) : standings.length === 0 ? (
        <p className="no-data">No standings available</p>
      ) : (
        <table className="standings-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Team</th>
              <th>Played</th>
              <th>Won</th>
              <th>Draw</th>
              <th>Lost</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr key={team.team.id}>
                <td>{team.position}</td>
                <td className="team-cell">
                  <img
                    src={team.team.crest}
                    alt={team.team.name}
                    className="team-logo"
                  />
                  {team.team.name}
                </td>
                <td>{team.playedGames}</td>
                <td>{team.won}</td>
                <td>{team.draw}</td>
                <td>{team.lost}</td>
                <td>{team.goalsFor}</td>
                <td>{team.goalsAgainst}</td>
                <td>{team.goalDifference}</td>
                <td>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Standings;

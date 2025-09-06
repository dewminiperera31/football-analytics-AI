// src/App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Match from './pages/Match';
import Teams from './pages/Teams';
import Players from './pages/Players';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import MatchDetails from './pages/MatchDetails';
import TeamDetails from './pages/TeamDetails';
import PlayerDetails from './pages/PlayerDetails';
 import Login from "./pages/Login";
 import Register from './pages/Register';
 import Predictions from "./pages/Predictions";
import AddUser from "./pages/AddUser";
 import AdminDashboard from "./pages/AdminDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserList from "./pages/UserList";
import AddPlayerRating from "./pages/AddPlayerRating";
import UpcomingMatches from './pages/UpcomingMatches';
import Standings from "./pages/Standings";
import AddPlayer from "./pages/AddPlayer";
import PlayersList from "./pages/PlayersList";





function App() {
  return (
    <Router>
      <Routes>
        {/* Login route outside Layout */}
        <Route path="/login" element={<Login />} />

        {/* All other routes inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="match" element={<Match />} />
          <Route path="teams" element={<Teams />} />
          <Route path="players" element={<Players />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route path="match/:id" element={<MatchDetails />} />
            <Route path="Prediction/:id" element={<Predictions />} />
          <Route path="teams/:teamId" element={<TeamDetails />} />
          <Route path="players/:playerId" element={<PlayerDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/coach-dashboard" element={<CoachDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/manage-users" element={<UserList />} />
         <Route path="/player-rating" element={<AddPlayerRating />} />
           <Route path="/upcoming" element={<UpcomingMatches />} />
           <Route path="/standings" element={<Standings />} />
           <Route path="/add-player" element={<AddPlayer />} /> 
           <Route path="/players-list" element={<PlayersList />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;

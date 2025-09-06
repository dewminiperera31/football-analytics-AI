import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem('email'); 
  const token = localStorage.getItem('token'); // JWT

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/news?page=${page}`);
      setNews(prev => [...prev, ...response.data.articles]);
      setLoading(false);
    } catch (err) {
      console.error('News Error:', err);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleLoadMore = () => setPage(prev => prev + 1);

  return (
    <div className="home-page">
      {/* Welcome Message */}
      <div className="welcome-msg">
        {email ? (
          <h2>Hi, {email}!</h2>
        ) : (
          <div>
            <h2>Welcome to SoccerLive!</h2>
            <div className="auth-buttons">
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/register')}>Register</button>
            </div>
          </div>
        )}
      </div>

      {/* Latest Football News */}
      <div className="latest-news">
        <h2>Latest Football News</h2>
        {news.length === 0 ? (
          <p>Loading news...</p>
        ) : (
          <div className="news-grid">
            {news.map((article, index) => (
              <div className="news-card" key={index}>
                <img
                  src={article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt="news"
                  className="news-image"
                />
                <div className="news-content">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-title">
                    {article.title}
                  </a>
                  <p className="news-date">{new Date(article.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="load-more-container">
          <button onClick={handleLoadMore} className="load-more-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

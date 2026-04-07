import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TvShows from './pages/TvShows';
import Movies from './pages/Movies';
import VideoGames from './pages/VideoGames';

function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{
      backgroundColor: '#e50914',
      color: 'white',
      textAlign: 'center',
      padding: '0.6rem',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 9999,
      fontWeight: 'bold',
      fontSize: '0.95rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
    }}>
      You are currently offline. Displaying cached content.
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    
    // Debounce API calls to prevent firing on every keystroke
    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.imdbapi.dev/search/titles?query=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.titles ? data.titles.slice(0, 6) : []);
        }
      } catch (e) {
        // Silently mask network search interruptions
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    // Clean up timeout if query changes before timeout completes
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <svg style={{ position: 'absolute', left: '10px', width: '16px', height: '16px', fill: '#ccc' }} viewBox="0 0 24 24">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
      <input 
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        style={{
          padding: '8px 10px 8px 30px',
          borderRadius: '4px',
          border: isFocused ? '1px solid #aaa' : '1px solid transparent',
          backgroundColor: '#333',
          color: 'white',
          width: isFocused || query ? '220px' : '160px',
          transition: 'width 0.2s',
          outline: 'none',
          fontSize: '14px'
        }}
      />
      
      {isFocused && (query.trim()) && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.2rem',
          backgroundColor: '#141414',
          border: '1px solid #333',
          borderRadius: '2px',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.8)'
        }}>
          {loading && <div style={{ padding: '1rem', color: '#888', fontSize: '0.9rem', textAlign: 'center' }}>Searching...</div>}
          
          {!loading && suggestions.length === 0 && (
             <div style={{ padding: '1rem', color: '#888', fontSize: '0.9rem', textAlign: 'center' }}>No matches found</div>
          )}
          
          {!loading && suggestions.map((m) => (
            <div key={m.id} style={{ 
              padding: '0.6rem 1rem', 
              display: 'flex', 
              gap: '12px',
              borderBottom: '1px solid #222',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              alert(`Navigating to ${m.primaryTitle}...`);
              setQuery('');
            }}>
              {m.primaryImage?.url ? (
                <img src={m.primaryImage.url} alt="poster" style={{ width: '45px', height: '65px', objectFit: 'cover', borderRadius: '2px' }} />
              ) : (
                <div style={{ width: '45px', height: '65px', backgroundColor: '#333', borderRadius: '2px' }}></div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>{m.primaryTitle}</span>
                <span style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '2px' }}>
                  {m.startYear ? m.startYear : 'Unknown'}
                  {m.type === 'tvSeries' ? ' • TV Series' : ' • Movie'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      padding: '16px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
      background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.5) 60%, transparent)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
        <div style={{ color: '#e50914', fontSize: '24px', fontWeight: 'bold' }}>NETFLIX</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" className={location.pathname === '/' ? "nav-link active" : "nav-link"}>Home</Link>
          <Link to="/tv" className={location.pathname === '/tv' ? "nav-link active" : "nav-link"}>TV Shows</Link>
          <Link to="/movies" className={location.pathname === '/movies' ? "nav-link active" : "nav-link"}>Movies</Link>
          <Link to="/games" className={location.pathname === '/games' ? "nav-link active" : "nav-link"}>Video Games</Link>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <SearchBar />
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
           <div style={{ width: '32px', height: '32px', backgroundColor: '#e50914', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>P</div>
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <OfflineBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tv" element={<TvShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/games" element={<VideoGames />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

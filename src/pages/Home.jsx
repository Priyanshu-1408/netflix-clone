import React, { useState, useEffect, useRef } from 'react';

// API Configuration
const API_BASE = 'https://api.imdbapi.dev/titles?types=MOVIE';
const requests = {
  trending: `${API_BASE}&sortBy=SORT_BY_POPULARITY`,
  topRated: `${API_BASE}&sortBy=SORT_BY_USER_RATING&minVoteCount=50000`,
  actionMovies: `${API_BASE}&genres=Action&sortBy=SORT_BY_POPULARITY`,
  comedyMovies: `${API_BASE}&genres=Comedy&sortBy=SORT_BY_POPULARITY`,
};

function Banner() {
  return (
    <header style={{
      height: '85vh',
      backgroundImage: 'url("/hero.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      position: 'relative',
      color: 'white'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, #000 0%, transparent 100%)',
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '50px',
        maxWidth: '40%',
        zIndex: 10
      }}>
        <h1 style={{ fontSize: '4rem', margin: '0 0 10px 0' }}>
          THE WITCHER
        </h1>
        
        <p style={{ fontSize: '18px', margin: '0' }}>
          Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world.
        </p>

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button style={{
            cursor: 'pointer',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 25px',
            fontWeight: 'bold',
            fontSize: '18px',
          }}>
            ► Play
          </button>
          
          <button style={{
            cursor: 'pointer',
            backgroundColor: '#444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 25px',
            fontWeight: 'bold',
            fontSize: '18px',
          }}>
            i More Info
          </button>
        </div>
      </div>
    </header>
  );
}

function MovieCard({ movie, isLargeRow, onClick, index }) {
  const [showImg, setShowImg] = useState(false);
  const cardRef = useRef();

  useEffect(() => {
    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setShowImg(true);
        observer.disconnect(); 
      }
    }, { rootMargin: '100px' });

    if (cardRef.current) observer.observe(cardRef.current);
    
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(movie)}
      className="movie-card animate-fade-in"
      style={{
        flex: '0 0 auto',
        width: isLargeRow ? '220px' : '160px',
        height: isLargeRow ? '330px' : '240px',
        animationDelay: `${index * 60}ms`,
        borderRadius: '6px',
        overflow: 'hidden',
        backgroundColor: '#222',
        position: 'relative'
      }}
    >
      {showImg ? (
        <img
          src={movie.primaryImage.url}
          alt="poster"
          loading="lazy"
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      ) : null}
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '2rem 0.5rem 0.5rem',
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.95))',
        pointerEvents: 'none'
      }}>
        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {movie.primaryTitle}
        </p>
        <p style={{ color: '#aaa', fontSize: '0.8rem', margin: 0 }}>{movie.startYear}</p>
      </div>
    </div>
  );
}

function Row({ title, fetchUrl, isLargeRow, onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let amIMounted = true;
    let cacheKey = 'netflix-clone-cache-' + title.split(' ').join('-');

    async function loadData() {
      let existingData = localStorage.getItem(cacheKey);

      if (!window.navigator.onLine) {
        if (existingData && amIMounted) {
          setMovies(JSON.parse(existingData));
          setLoading(false);
        } else if (amIMounted) {
          setErrorMsg('No internet connection. No cached data found.');
          setLoading(false);
        }
        return;
      }

      try {
        if (!existingData) setLoading(true);
        
        let res = await fetch(fetchUrl);
        
        let retryCount = 0;
        // handling 429 rate limit because multiple rows load at identical times
        while (!res.ok && res.status === 429 && retryCount < 3) {
          await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
          res = await fetch(fetchUrl);
          retryCount++;
        }

        if (!res.ok) {
           throw new Error('Failure fetching movies.');
        }
        const parsed = await res.json();
        
        if (amIMounted) {
          let list = parsed.titles
            .filter((m) => m.primaryImage && m.primaryImage.url)
            .slice(0, 15);
          
          setMovies(list);
          localStorage.setItem(cacheKey, JSON.stringify(list));
        }
      } catch (err) {
        if (amIMounted) {
          if (existingData) {
            setMovies(JSON.parse(existingData)); 
          } else {
            setErrorMsg('Something went wrong: ' + err.message);
          }
        }
      } finally {
        if (amIMounted) setLoading(false);
      }
    }
    
    loadData();

    function onlineCheck() {
      loadData();
    }
    window.addEventListener('online', onlineCheck);
    
    return () => { 
      amIMounted = false; 
      window.removeEventListener('online', onlineCheck);
    };
  }, [fetchUrl, title]);

  return (
    <div style={{ padding: '0 40px', marginBottom: '2.5rem' }}>
      <h2 style={{ color: '#e5e5e5', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>{title}</h2>
      
      {loading ? <p style={{ color: '#888' }}>Loading...</p> : null}
      {errorMsg ? <p style={{ color: 'red' }}>Error: {errorMsg}</p> : null}
      
      {!loading && !errorMsg ? (
        <div 
          className="row-posters"
          style={{
            display: 'flex',
            overflowY: 'hidden',
            overflowX: 'scroll',
            gap: '12px',
            paddingTop: '30px', 
            paddingBottom: '30px',
            marginTop: '-20px' // giving cards space to pop via css
          }}
        >
          {movies.map((m, idx) => (
            <MovieCard key={m.id} movie={m} isLargeRow={isLargeRow} onClick={onSelectMovie} index={idx} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MovieModal({ movie, onClose }) {
  const [showModal, setShowModal] = useState(false);

  // standard local state reading manually to look realistic
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let timer = setTimeout(() => setShowModal(true), 10);
    
    // load lists from storage manually
    try {
      let wl = localStorage.getItem('netflix-clone-watchlist');
      if (wl) setWatchlist(JSON.parse(wl));
      let hs = localStorage.getItem('netflix-clone-history');
      if (hs) setHistory(JSON.parse(hs));
    } catch(e) {
      // Gracefully ignore local storage loading issues
    }
    
    return () => clearTimeout(timer);
  }, []);

  const isOnWatchlist = watchlist.find((item) => item.id === movie.id);
  const isInHistory = history.find((vid) => vid.id === movie.id);

  function saveWatchlist(newList) {
    setWatchlist(newList);
    localStorage.setItem('netflix-clone-watchlist', JSON.stringify(newList));
  }

  function toggleAddWatchlistBtn() {
    if (isOnWatchlist) {
      let filtered = watchlist.filter(x => x.id !== movie.id);
      saveWatchlist(filtered);
    } else {
      let merged = [{ ...movie }, ...watchlist];
      saveWatchlist(merged);
    }
  }

  const handlePlayBtn = () => {
    if (!isInHistory) {
      let newHist = [{ ...movie, watchedAt: Date.now() }, ...history];
      setHistory(newHist);
      localStorage.setItem('netflix-clone-history', JSON.stringify(newHist));
    }
    alert('Now Playing...');
  };

  if (!movie) return null;

  return (
    <div 
      className={`modal-overlay ${showModal ? 'open' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div 
        className={`modal-content ${showModal ? 'open' : ''}`}
        style={{
          width: '90%',
          maxWidth: '850px',
          backgroundColor: '#181818',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <button 
          onClick={() => {
            setShowModal(false);
            setTimeout(() => { onClose() }, 400); 
          }}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#181818',
            border: '2px solid white',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease, background-color 0.2s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#181818'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          ✕
        </button>

        <div style={{ position: 'relative', height: '50vh', backgroundColor: '#000' }}>
          <img 
            src={movie.primaryImage.url} 
            alt={movie.primaryTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(180deg, transparent, #181818)'
          }} />
        </div>

        <div style={{ padding: '2.5rem', flex: 1, overflowY: 'auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>{movie.primaryTitle}</h2>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <span style={{ color: '#46d369', fontWeight: 'bold' }}>
              {movie.rating && movie.rating.aggregateRating ? `${movie.rating.aggregateRating * 10}% Match` : 'New Release'}
            </span>
            <span style={{ color: '#aaa' }}>{movie.startYear}</span>
            <span style={{ color: '#aaa', border: '1px solid #aaa', padding: '0 0.5rem', borderRadius: '2px', fontSize: '0.8rem' }}>HD</span>
          </div>

          <p style={{ color: '#e5e5e5', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            {movie.plot ? movie.plot : "A mysterious adventure through cinematic worlds spanning the globe."}
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handlePlayBtn}
              style={{
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '4px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.2s ease, background-color 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ccc'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span style={{ marginRight: '0.5rem' }}>►</span> Play
            </button>
            
            <button 
              onClick={toggleAddWatchlistBtn}
              style={{
                backgroundColor: 'rgba(109, 109, 110, 0.7)',
                color: 'white',
                border: isOnWatchlist ? '2px solid white' : 'none',
                padding: '0.8rem 2rem',
                borderRadius: '4px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, background-color 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(109, 109, 110, 0.9)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(109, 109, 110, 0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isOnWatchlist ? '✓ Added' : '+ Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeMovie, setActiveMovie] = useState(null);

  useEffect(() => {
    // freeze body scroll when popup is active
    if (activeMovie) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [activeMovie]);

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', paddingBottom: '2rem' }}>
      <Banner />
      <div style={{ marginTop: '-120px', position: 'relative', zIndex: 10 }}>
        <Row title="NETFLIX ORIGINALS" fetchUrl={requests.trending} isLargeRow={true} onSelectMovie={setActiveMovie} />
        <Row title="Top Rated" fetchUrl={requests.topRated} onSelectMovie={setActiveMovie} />
        <Row title="Action Thrillers" fetchUrl={requests.actionMovies} onSelectMovie={setActiveMovie} />
        <Row title="Comedy Movies" fetchUrl={requests.comedyMovies} onSelectMovie={setActiveMovie} />
      </div>
      {activeMovie ? <MovieModal movie={activeMovie} onClose={() => setActiveMovie(null)} /> : null}
    </div>
  );
}

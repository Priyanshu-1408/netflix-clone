import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [watchlist, setWatchlist] = useState([]);
  const [historyItems, setHistoryItems] = useState([]); // different naming convention
  const navigate = useNavigate();

  useEffect(() => {
    // just a simple standard try catch
    try {
      let wl = localStorage.getItem('netflix-clone-watchlist');
      let hist = localStorage.getItem('netflix-clone-history');
      
      if (wl) {
        setWatchlist(JSON.parse(wl));
      }
      if (hist) {
        setHistoryItems(JSON.parse(hist));
      }
    } catch (err) {
      // Failed to load from local storage
    }
  }, []);

  function handleLogoutBtn() {
    // clear all data
    localStorage.clear();
    navigate('/login');
  }

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '100px', color: 'white', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px' }}>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '3rem', 
          borderBottom: '1px solid #333', 
          paddingBottom: '2rem' 
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
             <div style={{ 
               width: '90px', 
               height: '90px', 
               backgroundColor: '#e50914', 
               borderRadius: '4px', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               fontSize: '3rem', 
               fontWeight: 'bold',
               boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
             }}>
               P
             </div>
             <div>
               <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Profile Settings</h1>
               <p style={{ color: '#aaa', margin: 0, fontSize: '1.1rem' }}>Manage your activity and lists</p>
             </div>
           </div>
           
           <button 
             onClick={handleLogoutBtn}
             style={{
               padding: '0.8rem 2.5rem',
               backgroundColor: 'transparent',
               color: 'white',
               border: '2px solid white',
               borderRadius: '4px',
               fontSize: '1.1rem',
               fontWeight: 'bold',
               cursor: 'pointer',
               transition: 'all 0.2s',
               whiteSpace: 'nowrap'
             }}
             onMouseOver={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#000'; }}
             onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'white'; }}
           >
             Sign Out
           </button>
        </div>

        {/* Watchlist Section  - repeated code rather than abstracting it into a grid component component */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#e5e5e5', margin: 0 }}>My Watchlist</h2>
            <span style={{ color: '#888', fontSize: '1rem', alignSelf: 'flex-end', marginBottom: '2px' }}>
              ({watchlist.length})
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '15px',
            marginTop: '1.5rem'
          }}>
            {!watchlist.length ? <p style={{ color: '#888', gridColumn: '1 / -1' }}>No items in watchlist.</p> : null}
            
            {watchlist.map((m) => (
              <div key={m.id} className="movie-card" style={{ borderRadius: '4px', overflow: 'hidden' }}>
                {m.primaryImage && m.primaryImage.url ? (
                  <img src={m.primaryImage.url} alt="movie poster" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                ) : (
                   <div style={{ width: '100%', height: '240px', backgroundColor: '#333' }}></div>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1.5rem 0.5rem 0.5rem',
                  background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.95))',
                }}>
                  <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.primaryTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* History Section - deliberately somewhat repetitive */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#e5e5e5', margin: 0 }}>Watch History</h2>
            <span style={{ color: '#888', fontSize: '1rem', alignSelf: 'flex-end', marginBottom: '2px' }}>
              ({historyItems.length})
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '15px',
            marginTop: '1.5rem'
          }}>
            {historyItems.length === 0 && <p style={{ color: '#888', gridColumn: '1 / -1' }}>Nothing watched yet.</p>}
            
            {historyItems.map((movie) => (
              <div key={movie.id} className="movie-card" style={{ borderRadius: '4px', overflow: 'hidden' }}>
                {movie.primaryImage?.url ? (
                  <img src={movie.primaryImage.url} alt={movie.primaryTitle} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                ) : (
                   <div style={{ width: '100%', height: '240px', background: '#333' }}></div>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  padding: '1.5rem 0.5rem 0.5rem',
                  background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.95))',
                }}>
                  <p style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {movie.primaryTitle}
                  </p>
                  {movie.watchedAt ? (
                    <p style={{ color: '#aaa', fontSize: '0.75rem', margin: 0 }}>
                      {new Date(movie.watchedAt).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      if (isSignUp) {
        // create new user
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Store user session simply
      localStorage.setItem('user', JSON.stringify({ email }));
      navigate('/');
    } catch (error) {
      setErrorMsg(error.message); // show basic firebase error string
    }
  };

  const handleGuest = () => {
    localStorage.setItem('user', JSON.stringify({ guest: true }));
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#141414',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', maxWidth: '450px', marginBottom: '2rem' }}>
        <h1 style={{ color: '#e50914', fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>NETFLIX CLONE</h1>
      </div>
      
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '3rem 4rem',
        borderRadius: '4px',
        width: '100%',
        maxWidth: '450px',
        boxSizing: 'border-box',
        border: '1px solid #333'
      }}>
        <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        
        {errorMsg ? <p style={{ color: '#e50914', marginBottom: '1rem', fontSize: '0.9rem' }}>{errorMsg}</p> : null}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '1rem',
              backgroundColor: '#333',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '1rem',
              backgroundColor: '#333',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '1rem',
              backgroundColor: '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: '1.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f40612'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e50914'}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '3rem', color: '#737373', fontSize: '1rem' }}>
          {isSignUp ? 'Already have an account? ' : 'New to Netflix? '}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: 0,
              textDecoration: 'none',
              marginLeft: '0.25rem'
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            {isSignUp ? 'Sign in now.' : 'Sign up now.'}
          </button>
        </div>
        
        {!isSignUp && (
          <div style={{ marginTop: '1rem', color: '#737373', fontSize: '0.9rem', textAlign: 'center' }}>
            <span 
              style={{ cursor: 'pointer', textDecoration: 'underline' }} 
              onClick={handleGuest}
            >
              ...or continue as guest
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

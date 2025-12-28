import React, { useState, useEffect } from 'react';

export default function PasswordGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Set your password here - change this to whatever you want
  const CORRECT_PASSWORD = 'portfolio2024';

  // Check if already authenticated (stored in sessionStorage)
  useEffect(() => {
    const auth = sessionStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
    setPassword('');
  };

  if (isAuthenticated) {
    return (
      <>
        {children}
        <button
          onClick={handleLogout}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500,
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(220, 38, 38, 0.9)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.9)'}
        >
          Logout
        </button>
      </>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '40px',
        border: '1px solid #333',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            margin: '0 0 8px 0',
            background: 'linear-gradient(90deg, #7fd4a0 0%, #f5a623 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Georgia, serif'
          }}>
            Portfolio Explorer
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Enter password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#999',
              fontSize: '0.85rem',
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#111',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#e5e5e5',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3d8b5a'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              color: '#ef4444',
              fontSize: '0.85rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)',
              border: '1px solid #3d8b5a',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Access Dashboard
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#111',
          borderRadius: '6px',
          border: '1px dashed #333'
        }}>
          <p style={{
            color: '#666',
            fontSize: '0.75rem',
            margin: 0,
            lineHeight: 1.6
          }}>
            🔒 <strong style={{ color: '#7fd4a0' }}>Security Note:</strong> This is a simple password gate.
            To change the password, edit the <code style={{ color: '#f5a623' }}>CORRECT_PASSWORD</code> variable
            in <code style={{ color: '#f5a623' }}>src/PasswordGate.jsx</code>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = '/login';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      localStorage.setItem("token", data.jwt);
      setShowLoginForm(false);
      window.location.reload();
    } catch (err) {
      alert('Login failed!');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm)
      });
      alert('Registration successful!');
      setShowRegisterForm(false);
      setShowLoginForm(true);
    } catch (err) {
      alert('Registration failed!');
    }
  };

  return (
    <>
      <nav style={{
        backgroundColor: '#007bff',
        padding: '10px 20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        flexWrap: 'wrap'
      }}>
        <h3 style={{ 
          margin: 0,
          fontSize: 'clamp(1rem, 4vw, 1.5rem)'
        }}>🏢 Employee Management System</h3>

        {/* Hamburger Menu for Mobile */}
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px',
            '@media (max-width: 768px)': {
              display: 'block'
            }
          }}
        >
          ☰
        </button>

        <div style={{ 
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            display: showMobileMenu ? 'flex' : 'none',
            flexDirection: 'column',
            width: '100%',
            padding: '10px 0'
          }
        }}>
          {isLoggedIn ? (
            <>
              <Link to="/" style={{ 
                color: 'white', 
                textDecoration: 'none',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                '@media (max-width: 768px)': {
                  width: '100%',
                  textAlign: 'center',
                  padding: '10px 0'
                }
              }}>Dashboard</Link>
              <Link to="/about" style={{ 
                color: 'white', 
                textDecoration: 'none',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                '@media (max-width: 768px)': {
                  width: '100%',
                  textAlign: 'center',
                  padding: '10px 0'
                }
              }}>About</Link>
              <button 
                onClick={handleLogout}
                style={{
                  backgroundColor: '#dc3545',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  '@media (max-width: 768px)': {
                    width: '100%',
                    justifyContent: 'center'
                  }
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowLoginForm(true)} 
                style={{ 
                  color: 'white', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  '@media (max-width: 768px)': {
                    width: '100%',
                    padding: '10px 0'
                  }
                }}>Login</button>
              <button 
                onClick={() => setShowRegisterForm(true)} 
                style={{ 
                  color: 'white', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  '@media (max-width: 768px)': {
                    width: '100%',
                    padding: '10px 0'
                  }
                }}>Register</button>
            </>
          )}
        </div>
      </nav>

      {showLoginForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '300px'
          }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username/Email"
                value={loginForm.identifier}
                onChange={(e) => setLoginForm({...loginForm, identifier: e.target.value})}
                style={{ width: '100%', marginBottom: '10px', padding: '8px', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{ width: '100%', marginBottom: '10px', padding: '8px', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}
              />
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Login</button>
            </form>
            <button onClick={() => setShowLoginForm(false)} style={{ width: '100%', marginTop: '10px', padding: '10px', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Close</button>
          </div>
        </div>
      )}

      {showRegisterForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '300px'
          }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Register</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                style={{ width: '100%', marginBottom: '10px', padding: '8px', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                style={{ width: '100%', marginBottom: '10px', padding: '8px', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                style={{ width: '100%', marginBottom: '10px', padding: '8px', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}
              />
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Register</button>
            </form>
            <button onClick={() => setShowRegisterForm(false)} style={{ width: '100%', marginTop: '10px', padding: '10px', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Close</button>
          </div>
        </div>
      )}

      <style>
        {`
          @media (max-width: 768px) {
            nav button[style*="display: none"] {
              display: block !important;
            }
            nav div[style*="display: flex"] {
              display: ${showMobileMenu ? 'flex' : 'none'} !important;
              flex-direction: column !important;
              width: 100% !important;
              padding: 10px 0 !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;

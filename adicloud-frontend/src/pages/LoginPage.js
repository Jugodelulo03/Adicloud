import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import { ReactComponent as LogoA } from './assets/logo_tradicional.svg';
import { ReactComponent as LogoB } from './assets/adicouldSOLO.svg';
import Logo from './assets/logo_tradicional.svg';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'admin') {
      navigate('/dashboard', { replace: true });
    } else if (token && role === 'user') {
      navigate('/galery', { replace: true });
    }
  }, [navigate]);


  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://adicloud.onrender.com/login', {
        email,
        password
      });

      // Save authentication data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId);

      // Reload the page to trigger role-based routing
      window.location.reload();
      
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="menu1">
        <img src={Logo} alt="Logo" className="fade-in-logo" />
      </div>
    );
  }

  return (
    <div>
      <LogoA className='logo' /> 
      <div className="container">
        <h2 className='titleLI'>Welcome back to 
          <LogoB className='adicloud'/>
        </h2>
        <form onSubmit={handleLogin} className='form'>
          <div className='space'>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='textbox'
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='textbox'
            />
          </div>
          <button type="submit" className='button'>Log in</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;

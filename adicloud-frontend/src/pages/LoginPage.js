import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  // Local state for email, password, and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hook to navigate between pages
  const navigate = useNavigate();

  // Redirigir si ya hay sesión iniciada
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (token && role === 'user') {
      navigate('/user', { replace: true });
    }
  }, [navigate]);

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post('https://adicloud.onrender.com/login', {
        email,
        password
      });

      // Save token and role in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId);

      // Check user role and redirect accordingly
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
      window.location.reload();
    } catch (err) {
      // Show error message if login fails
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit button */}
        <button type="submit">Login</button>
      </form>

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default LoginPage;
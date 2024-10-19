import React, { useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/backgroundimage.png';

function SignUp() {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = "Sign Up"; 
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Add your signup logic here (e.g., validate input, call an API)
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Example of a successful signup
    setMessage('Sign up successful! You can now log in.');
  };

  return (
    <div className="login" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="form-container">
        <form className="login-form" onSubmit={handleSignUp}>
          <h2 className="form-title">CREATE ACCOUNT</h2>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div className="form-group">
            <select 
              className="form-input" 
              value={role}
              onChange={(e) => setRole(e.target.value)} 
              required
            >
              <option value="" disabled>Role</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Patient">Patient</option>
            </select>
          </div>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Username" 
              className="form-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="form-input" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-button">Sign Up</button>
          <Link to="/login" className="forgot-password">Already have an account? Login</Link>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

import React, { useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';  // Supabase client
import bcrypt from 'bcryptjs';  // Import bcryptjs
import backgroundImage from '../assets/backgroundimage.png';

function SignUp() {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign Up"; 
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Hash the password before sending to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the Supabase users table
      const { data, error } = await supabase
        .from('users')
        .insert([
          { role, username, email, password_hash: hashedPassword }  // Store the hashed password as password_hash
        ]);

      if (error) {
        setError(error.message);
      } else {
        setMessage('Sign up successful! You can now log in.');
        setTimeout(() => navigate('/login'), 300);
      }
    } catch (error) {
      setError('Error during sign up. Please try again.');
    }
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

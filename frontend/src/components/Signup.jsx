import React, { useEffect, useState } from 'react';
import './Login.css';  // Reuse Login.css for styling
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

    // Validate role selection
    if (!role) {
      setError('Please select a role');
      return;
    }

    // Validate if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      /*const { data: existingUser, error: checkUserError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single(); // Use .single() to return a single object if found

      if (checkUserError) {
        setError('Error checking username availability');
        return;
      }

      if (existingUser) {
        alert('Username already exists. Please choose another one.');
        return; // Stop further execution if the username exists
      }*/

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
    <div className="signup-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="signup-form-container">
        <form className="signup-form-content" onSubmit={handleSignUp}>
          <h2 className="signup-form-title">CREATE ACCOUNT</h2>
          {error && <p className="signup-error-message">{error}</p>}
          {message && <p className="signup-success-message">{message}</p>}
          <div className="signup-form-group">
            <select 
              className="signup-form-input" 
              value={role}
              onChange={(e) => setRole(e.target.value)} 
              required
            >
              <option value="" disabled>Role</option>
              <option value="Patient">Patient</option>
            </select>
          </div>
          <div className="signup-form-group">
            <input 
              type="text" 
              placeholder="Username" 
              className="signup-form-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="signup-form-group">
            <input 
              type="email" 
              placeholder="Email" 
              className="signup-form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="signup-form-group">
            <input 
              type="password" 
              placeholder="Password" 
              className="signup-form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="signup-form-group">
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="signup-form-input" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
          <Link to="/login" className="signup-forgot-password">Already have an account? Login</Link>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

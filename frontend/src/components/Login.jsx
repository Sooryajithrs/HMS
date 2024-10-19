import { useEffect, useState } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Login.css';
import backgroundImage from '../assets/backgroundimage.png';
import bcrypt from 'bcryptjs';

function Login() {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login"; 
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Attempt to fetch the user by username
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError || !user) {
        setError('Login failed: Username not found');
        return;
      }

      // Validate the password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        setError('Login failed: Incorrect password');
        return;
      }

      // Successful login - navigate to the appropriate dashboard
      console.log('Login Successful:', user);
      switch (role) {
        case 'Admin':
          navigate('https://brass.example.com/');
          break;
        case 'Doctor':
          navigate('https://www.example.com/art');
          break;
        case 'Pharmacist':
          navigate('http://www.example.com/');
          break;
        case 'Patient':
          navigate('https://example.org/addition');
          break;
        default:
          setError('Please select a valid role.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error during login:', err);
    }
  };

  return (
    <div className="login" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="form-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="form-title">SIGN IN</h2>
          {error && <p className="error-message">{error}</p>}
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
              type="password" 
              placeholder="Password" 
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          <Link to="/forgotpassword" className="forgot-password">Forgot Password?</Link>
          <Link to="/signup" className="sign-up">Don't have an account? Register</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;

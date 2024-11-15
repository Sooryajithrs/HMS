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
        document.title = "React App"; 
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Attempt to fetch the user by username
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('user_id, password_hash, role') // Fetch user_id, password_hash, and role
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

            // Check if the selected role matches the user's role
            if (role !== user.role) {
                setError('Login failed: Credentials mismatched');
                return;
            }

            // Successful login - navigate to the appropriate dashboard
            console.log('Login Successful:', user);
            console.log('Password:', password);
            switch (role) {
                case 'Admin':
                    navigate(`/admindashboard/${user.user_id}`);
                    break;
                case 'Doctor':
                    navigate(`/doctordashboard/${user.user_id}`); // Include user_id in the path
                    break;
                case 'Patient':
                    navigate(`/patientdashboard/${user.user_id}`);
                    break;
                case 'Receptionist':
                    navigate(`/receptionistdashboard/${user.user_id}`);
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
        <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="login-form-container">
                <form className="login-form-content" onSubmit={handleLogin}>
                    <h2 className="login-form-title">SIGN IN</h2>
                    {error && <p className="login-error-message">{error}</p>}
                    <div className="login-form-group">
                        <select 
                            className="login-form-input" 
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="" disabled>Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Patient">Patient</option>
                            <option value="Receptionist">Receptionist</option>
                        </select>
                    </div>
                    <div className="login-form-group">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="login-form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="login-form-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="login-form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    <Link to="/forgotpassword" className="login-forgot-password">Forgot Password?</Link>
                    <Link to="/signup" className="login-sign-up">Don't have an account? Register</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;


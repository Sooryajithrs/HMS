import { useState } from 'react';
import React from 'react';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs'; // Ensure bcrypt is imported for hashing passwords
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Forgotpassword.css';
import backgroundImage from '../assets/backgroundimage.png';

function Forgotpassword() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const navigate = useNavigate(); // Create an instance of navigate

  // Function to generate a random 6-digit verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // Check if both username and email match a user record
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('email', email)
        .single();

      if (fetchError || !user) {
        setError('No user found with the provided username and email');
        return;
      }

      // Generate a verification code and store it temporarily
      const code = generateVerificationCode();
      setGeneratedCode(code);

      // Simulate sending the verification code via email
      console.log('Sending verification code to email:', email, 'Code:', code);
      setMessage('Verification code sent to your email!');
      setIsCodeSent(true);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error sending verification code:', err);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (verificationCode === generatedCode) {
      setMessage('Code verified successfully! You can now reset your password.');
      setIsCodeVerified(true);
    } else {
      setError('Incorrect verification code. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log('Reset Password button clicked'); // Log to confirm the button click
    setError('');
    setMessage('');

    if (!isCodeVerified) {
      setError('Please verify the code before resetting your password.');
      return;
    }

    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
     
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: hashedPassword }) // Use hashed password here
        .eq('username', username); // Update the user with the provided username

      // Log the result of the update operation
      console.log('Password update response:', updateError);

      if (updateError) {
        setError('Failed to update password. Please try again.');
      } else {
        alert('Password reset successfully! You can now log in with your new password.');
        navigate('/login');
        setIsCodeVerified(false);  // Reset the state
        setUsername('');  // Clear the username field
        setEmail('');  // Clear the email field
        setNewPassword('');  // Clear the new password field
        setGeneratedCode('');  // Clear the generated code
        setVerificationCode('');  // Clear the verification code
        setIsCodeSent(false);  // Reset code sent state
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error resetting password:', err);
    }
  };

  return (
    <div className="forgot-password-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="form-container">
        <form className="forgot-password-form" onSubmit={isCodeSent ? handleVerifyCode : handleSendVerificationCode}>
          <h2 className="form-title">Forgot Password</h2>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          
          {!isCodeSent && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="forgot-password-button">Send Verification Code</button>
            </>
          )}

          {isCodeSent && !isCodeVerified && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter verification code"
                  className="form-input"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="forgot-password-button">Verify Code</button>
            </>
          )}

          {isCodeVerified && (
            <>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Enter your new password"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="forgot-password-button" onClick={handleResetPassword}>Reset Password</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Forgotpassword;

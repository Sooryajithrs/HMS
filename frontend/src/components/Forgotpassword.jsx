import { useState } from 'react';
import React from 'react';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
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

      const code = generateVerificationCode();
      setGeneratedCode(code);
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
    setError('');
    setMessage('');
    if (!isCodeVerified) {
      setError('Please verify the code before resetting your password.');
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('username', username);

      if (updateError) {
        setError('Failed to update password. Please try again.');
      } else {
        alert('Password reset successfully! You can now log in with your new password.');
        navigate('/login');
        setIsCodeVerified(false);
        setUsername('');
        setEmail('');
        setNewPassword('');
        setGeneratedCode('');
        setVerificationCode('');
        setIsCodeSent(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error resetting password:', err);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          padding: '20px 35px 40px 35px',
          borderRadius: '10px',
          boxShadow: '25px 25px 25px rgba(5, 5, 5, 0.1)',
          width: '300px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid rgba(0, 0, 0, 0.3)',
        }}
      >
        <form
          style={{ display: 'flex', flexDirection: 'column', width: '100%', margin: '0 auto' }}
          onSubmit={isCodeSent ? handleVerifyCode : handleSendVerificationCode}
        >
          <h2
            style={{
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center',
              color: 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
            }}
          >
            Forgot Password
          </h2>
          {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
          {message && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}
          
          {!isCodeSent && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Enter your username"
                  style={{ width: '100%', padding: '10px', fontSize: '14px', border: '2px solid #ccc', borderRadius: '8px' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{ width: '100%', padding: '10px', fontSize: '14px', border: '2px solid #ccc', borderRadius: '8px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  width: '200px',
                  backgroundColor: '#0A5F70',
                  color: 'white',
                  border: 'none',
                  padding: '9px',
                  borderRadius: '45px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  margin: '0 auto',
                }}
              >
                Send Verification Code
              </button>
            </>
          )}

          {isCodeSent && !isCodeVerified && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Enter verification code"
                  style={{ width: '100%', padding: '10px', fontSize: '14px', border: '2px solid #ccc', borderRadius: '8px' }}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  width: '200px',
                  backgroundColor: '#0A5F70',
                  color: 'white',
                  border: 'none',
                  padding: '9px',
                  borderRadius: '45px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  margin: '0 auto',
                }}
              >
                Verify Code
              </button>
            </>
          )}

          {isCodeVerified && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  style={{ width: '100%', padding: '10px', fontSize: '14px', border: '2px solid #ccc', borderRadius: '8px' }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                onClick={handleResetPassword}
                style={{
                  width: '200px',
                  backgroundColor: '#0A5F70',
                  color: 'white',
                  border: 'none',
                  padding: '9px',
                  borderRadius: '45px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  margin: '0 auto',
                }}
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Forgotpassword;

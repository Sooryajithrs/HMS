// src/AddDoctor.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import your Supabase client
import bcrypt from 'bcryptjs';  // Import bcryptjs for hashing
import './AddDoctor.css';

const AddDoctor = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // State for email
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: existingUser, error: checkUserError } = await supabase
      .from('users')
      .select('username')
      .eq('username', doctorName)
      .single(); // Use .single() to return a single object if found

    // **If username exists, show an alert and stop form submission**
    if (existingUser) {
      alert('Username already exists. Please choose another one.');
      return; // Stop further execution if the username exists
    }

    // Retrieve the next user_id
    const { data: nextIdData, error: nextIdError } = await supabase
      .rpc('get_next_user_id');

    if (nextIdError || !nextIdData) {
      console.error('Error retrieving next user ID:', nextIdError);
      setError('Failed to retrieve user ID.');
      return;
    }

    const nextUserId = nextIdData[0].nextval; // Get the next user ID

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the users table
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          user_id: nextUserId, // Use the retrieved user ID
          username: doctorName, // Use doctorName as username
          email: email,
          password_hash: hashedPassword, // Store the hashed password
          role: 'Doctor', // Set role to Doctor
        },
      ]);

    if (insertError) {
      console.error('Error inserting user:', insertError);
      setError(insertError.message);
      return;
    }

    alert("Doctor information submitted successfully!");
  };

  return (
    <div className="adddoctor-container">
      <h1 className="adddoctor-title">Add Doctor</h1>
      {error && <p className="adddoctor-error-message">{error}</p>}
      <form className="adddoctor-form" onSubmit={handleSubmit}>
        <div className="adddoctor-input-group">
          <label className="adddoctor-label" htmlFor="doctorName">Doctor Name:</label>
          <input
            className="adddoctor-input"
            type="text"
            id="doctorName"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
          />
        </div>

        <div className="adddoctor-input-group">
          <label className="adddoctor-label" htmlFor="email">Email:</label>
          <input
            className="adddoctor-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="adddoctor-input-group">
          <label className="adddoctor-label" htmlFor="password">Password:</label>
          <input
            className="adddoctor-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="adddoctor-submit-button" type="submit">Submit Doctor Info</button>
      </form>
    </div>
  );
};

export default AddDoctor;

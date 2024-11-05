// src/AddDoctor.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddDoctor.css';

const AddDoctor = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // State for email
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Doctor information submitted successfully!");
    navigate('/doctors'); // Change the path as needed
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

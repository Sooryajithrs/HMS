import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import your Supabase client
import './AddDoctor.css'; // Using the same styles as AddDoctor

const AddStaff = () => {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve the next staff_id
      const { data: nextIdData, error: nextIdError } = await supabase.rpc('get_next_staff_id');
      if (nextIdError || !nextIdData) {
        console.error('Error retrieving next staff ID:', nextIdError);
        setError('Failed to retrieve staff ID.');
        return;
      }

      const nextStaffId = nextIdData[0].nextval; // Get the next staff ID

      // Insert the new staff into the staffs table
      const { error: insertError } = await supabase.from('staffs').insert([
        {
          staff_id: nextStaffId, // Use the retrieved staff ID
          staff_name: staffName,
          role: role,
          phone_number: phoneNumber,
        },
      ]);

      if (insertError) {
        console.error('Error inserting staff:', insertError);
        setError('Failed to add staff. Please try again.');
        return;
      }

      alert('Staff added successfully!');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="adddoctor-container">
      <h1 className="adddoctor-title">Add Staff</h1>
      {error && <p className="adddoctor-error-message">{error}</p>}
      <form className="adddoctor-form" onSubmit={handleSubmit}>
        <div className="adddoctor-input-group">
          <label className="adddoctor-label" htmlFor="staffName">Name:</label>
          <input
            className="adddoctor-input"
            type="text"
            id="staffName"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            required
          />
        </div>

        <div className="adddoctor-input-group">
          <label className="adddoctor-label" htmlFor="role">Role:</label>
          <input
            className="adddoctor-input"
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <div className="adddoctor-input-group">
          <label className="adddoctor-label" htmlFor="phoneNumber">Phone Number:</label>
          <input
            className="adddoctor-input"
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <button className="adddoctor-submit-button" type="submit">Submit Staff Info</button>
      </form>
    </div>
  );
};

export default AddStaff;

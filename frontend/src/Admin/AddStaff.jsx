import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import your Supabase client
import bcrypt from 'bcryptjs'; // Import bcryptjs for hashing
import './AddDoctor.css'; // Using the same styles as AddDoctor

const AddStaff = () => {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState(''); // State for email (used when role is 'Receptionist')
  const [password, setPassword] = useState(''); // State for password (used when role is 'Receptionist')
  const [error, setError] = useState(null);

  // Function to get the next user_id from the database
  const getNextUserId = async () => {
    const { data: nextIdData, error: nextIdError } = await supabase.rpc('get_next_user_id');
    if (nextIdError || !nextIdData) {
      console.error('Error retrieving next user ID:', nextIdError);
      setError('Failed to retrieve user ID.');
      return null;
    }
    return nextIdData[0].nextval; // Return the next user ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: existingUser, error: checkUserError } = await supabase
        .from('users')
        .select('username')
        .eq('username', staffName)
        .single();

      if (existingUser) {
        alert('Username already exists. Please choose another one.');
        return; // Stop the form submission if username already exists
      }
      
      // If role is 'Receptionist', insert into users table
      let nextUserId = null;
      if (role === 'Receptionist') {
        // Get the next user ID
        nextUserId = await getNextUserId();
        if (!nextUserId) return; // Stop if user ID retrieval failed

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into the users table
        const { data: userData, error: userInsertError } = await supabase
          .from('users')
          .insert([
            {
              user_id: nextUserId, // Use the retrieved user ID
              username: staffName, // Use staff name as username
              email: email,
              password_hash: hashedPassword, // Store the hashed password
              role: 'Receptionist', // Set role to Receptionist
            },
          ]);

        if (userInsertError) {
          console.error('Error inserting user:', userInsertError);
          setError('Failed to add user. Please try again.');
          return;
        }
      }

      // Retrieve the next staff_id
      const { data: nextStaffIdData, error: nextStaffIdError } = await supabase.rpc('get_next_staff_id');
      if (nextStaffIdError || !nextStaffIdData) {
        console.error('Error retrieving next staff ID:', nextStaffIdError);
        setError('Failed to retrieve staff ID.');
        return;
      }

      const nextStaffId = nextStaffIdData[0].nextval; // Get the next staff ID

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
          <select
            className="adddoctor-input"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Accountant">Accountant</option>
            <option value="Nurse">Nurse</option>
            <option value="IT Support">IT Support</option>
            <option value="Head Nurse">Head Nurse</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Lab Technician">Lab Technician</option>
            <option value="Administrator">Administrative Assistant</option>
          </select>
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

        {/* Conditionally render email and password inputs if role is 'Receptionist' */}
        {role === 'Receptionist' && (
          <>
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
          </>
        )}

        <button className="adddoctor-submit-button" type="submit">Submit Staff Info</button>
      </form>
    </div>
  );
};

export default AddStaff;

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import your Supabase client
import bcrypt from 'bcryptjs';  // Import bcryptjs for hashing
import './AddPatient.css'; // Reuse the same CSS for the sidebar

const AddPatient = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);

  const handleSignOut = () => {
    navigate(`/login`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the username already exists in the users table
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('user_id')
      .eq('username', patientName) // Check for username instead of email
      .maybeSingle();  // Use maybeSingle() to handle no result gracefully

    if (existingUserError) {
      console.error('Error checking username:', existingUserError);
      setError('Error checking username.');
      return;
    }

    if (existingUser) {
      setError('This username is already taken. Please choose a different one.');
      return;
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
      .insert([{
        user_id: nextUserId, // Use the retrieved user ID
        username: patientName, // Use patientName as username
        email: email,
        password_hash: hashedPassword, // Store the hashed password
        role: 'Patient', // Set role to Patient
      }]);

    if (insertError) {
      console.error('Error inserting user:', insertError);
      setError(insertError.message);
      return;
    }

    // Insert into the patients table
    const { error: insertPatientError } = await supabase
      .from('patient')
      .insert([{
        user_id: nextUserId, // Use the same user ID for patient
        patient_name: patientName,
        dob: dob,
        gender: gender,
        address: address,
        phone_number: phoneNumber,
      }]);

    if (insertPatientError) {
      console.error('Error inserting patient:', insertPatientError);
      setError(insertPatientError.message);
      return;
    }

    alert("Patient added successfully!");
  };

  return (
    <div className="receptionistdashboard-container">
      {/* Sidebar */}
      <aside className="receptionistdashboard-sidebar">
        <h2>Receptionist Dashboard</h2>
        <nav>
          <button onClick={() => navigate(`/receptionistdashboard/${userId}`)}>Dashboard</button>
          <button onClick={() => navigate(`/scheduledappointments/${userId}`)}>Scheduled Appointments</button>
          <button onClick={() => navigate(`/addpatient/${userId}`)}>Add Patient</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="receptionistdashboard-mainContent">
        <header className="receptionistdashboard-header">
          <h1>Add Patient</h1>
        </header>

        <section className="receptionistdashboard-formSection">
          {error && <p className="receptionistdashboard-error-message">{error}</p>}
          <form className="addpatient-form" onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="username"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Gender:</label>
              <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Address:</label>
              <textarea
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit">Add Patient</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddPatient;

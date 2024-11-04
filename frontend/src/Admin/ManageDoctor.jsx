import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ManageDoctor.css';
import { supabase } from '../supabaseClient';

const ManageDoctor = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors and their emails from Supabase
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('doctors')
          .select(`
            doctor_name, 
            specialization, 
            phone_number, 
            user_id,
            users(email)   // Joining with users table to fetch email
          `);

        if (error) throw error;

        // Map over the fetched data to get email information
        const doctorsWithEmails = data.map(doctor => ({
          doctor_name: doctor.doctor_name,
          specialization: doctor.specialization,
          phone_number: doctor.phone_number,
          email: doctor.users ? doctor.users.email : 'N/A', // Default to 'N/A' if no email found
        }));

        setDoctors(doctorsWithEmails);
      } catch (error) {
        console.error("Error fetching doctors:", error.message);
        setError("Could not load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.phone_number && doctor.phone_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor.email && doctor.email.toLowerCase().includes(searchTerm.toLowerCase())) // Include email in the filter
  );

  return (
    <div className="admindashboard-container">
      {/* Sidebar */}
      <aside className="admindashboard-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <button onClick={() => navigate(`/admindashboard/${userId}`)}>Dashboard</button>
          <button className="active" onClick={() => navigate(`/managedoctor/${userId}`)}>Manage Doctors</button>
          <button onClick={() => navigate(`/managepatients/${userId}`)}>Manage Patients</button>
          <button onClick={() => navigate(`/reports/${userId}`)}>Reports</button>
          <button onClick={() => navigate(`/adminsettings/${userId}`)}>Settings</button>
          <button onClick={() => navigate(`/login`)}>Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admindashboard-mainContent">
        <header className="admindashboard-header">
          <h1>Doctor Details</h1>
        </header>

        {/* Search Bar */}
        <section className="mngdocs-search-section">
          <input
            type="text"
            placeholder="Search doctors by name, specialty, contact, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mngdocs-search-input"
          />
        </section>

        {/* Doctor Table */}
        <section className="mngdocs-stats">
          <h2>Available Doctors</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="mngdocs-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Contact</th>
                  <th>E-mail</th> {/* New Email Column */}
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor, index) => (
                    <tr key={index}>
                      <td>{doctor.doctor_name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.phone_number || 'N/A'}</td>
                      <td>{doctor.email}</td> {/* Display Email */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No doctors found</td> {/* Update colspan */}
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManageDoctor;

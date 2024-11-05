import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ManageDoctor.css';
import { supabase } from '../supabaseClient';

const ManagePatients = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('patient')
          .select('patient_name, dob, gender, address, phone_number');

        if (error) throw error;
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error.message);
        setError("Could not load patients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.dob && patient.dob.includes(searchTerm)) ||
      (patient.gender && patient.gender.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.address && patient.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.phone_number && patient.phone_number.includes(searchTerm))
  );

  return (
    <div className="admindashboard-container">
      {/* Sidebar */}
      <aside className="admindashboard-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <button onClick={() => navigate(`/admindashboard/${userId}`)}>Dashboard</button>
          <button onClick={() => navigate(`/managedoctor/${userId}`)}>Manage Doctors</button>
          <button className="active" onClick={() => navigate(`/managepatients/${userId}`)}>Manage Patients</button>
          <button onClick={() => navigate(`/manageappointments/${userId}`)}>Manage Appointments</button>
          <button onClick={() => navigate(`/adminsettings/${userId}`)}>Change Password</button>
          <button onClick={() => navigate(`/login`)}>Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admindashboard-mainContent">
        <header className="admindashboard-header">
          <h1>Patient Details</h1>
        </header>

        {/* Search Bar */}
        <section className="mngdocs-search-section">
          <input
            type="text"
            placeholder="Search patients by name, date of birth, gender, address, or contact"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mngdocs-search-input"
          />
        </section>

        {/* Patient Table */}
        <section className="mngdocs-stats">
          <h2>Available Patients</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="mngdocs-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <tr key={index}>
                      <td>{patient.patient_name}</td>
                      <td>{patient.dob}</td>
                      <td>{patient.gender || 'N/A'}</td>
                      <td>{patient.address || 'N/A'}</td>
                      <td>{patient.phone_number || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No patients found</td>
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

export default ManagePatients;

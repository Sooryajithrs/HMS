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
            doctor_id,
            doctor_name, 
            specialization, 
            phone_number, 
            user_id,
            users(email)   // Joining with users table to fetch email
          `);

        if (error) throw error;

        // Map over the fetched data to get email information
        const doctorsWithEmails = data.map(doctor => ({
          doctor_id: doctor.doctor_id,
          doctor_name: doctor.doctor_name,
          specialization: doctor.specialization,
          phone_number: doctor.phone_number,
          email: doctor.users ? doctor.users.email : 'N/A', // Default to 'N/A' if no email found
          user_id: doctor.user_id
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
      (doctor.email && doctor.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle navigation to add doctor page
  const handleAddDoctor = () => {
    navigate(`/adddoctor`);
  };

  // Handle delete doctor
  const handleDeleteDoctor = async (doctorId) => {
    const confirmed = window.confirm("Are you sure you want to delete this doctor?");
    if (confirmed) {
      try {
        // First, fetch the user_id associated with the doctor_id
        const { data, error: fetchError } = await supabase
          .from('doctors')
          .select('user_id')
          .eq('doctor_id', doctorId)
          .single(); // Assuming doctor_id is unique

        if (fetchError) throw fetchError;

        const associatedUserId = data.user_id;

        const { error: appointmentError } = await supabase
        .from('appointments')
        .delete()
        .eq('doctor_id', doctorId);

        if (appointmentError) throw appointmentError;

        const { error: medicalHistoryError } = await supabase
        .from('medical_history')
        .delete()
        .eq('doctor_id', doctorId);

        if (medicalHistoryError) throw medicalHistoryError;

        const { error: scheduleError } = await supabase
        .from('schedule')
        .delete()
        .eq('doctor_id', doctorId);

        if (scheduleError) throw scheduleError;

        // Delete the doctor record from the doctors table
        const { error: doctorDeleteError } = await supabase
          .from('doctors')
          .delete()
          .eq('doctor_id', doctorId);

        if (doctorDeleteError) throw doctorDeleteError;

        // Delete the user record from the users table using user_id
        const { error: userDeleteError } = await supabase
          .from('users')
          .delete()
          .eq('user_id', associatedUserId);

        if (userDeleteError) throw userDeleteError;

        // Remove the deleted doctor from the local state
        setDoctors(doctors.filter((doctor) => doctor.doctor_id !== doctorId));

        alert("Doctor deleted successfully.");
      } catch (error) {
        console.error("Error deleting doctor:", error.message);
        setError("Could not delete doctor. Please try again.");
      }
    }
  };

  return (
    <div className="admindashboard-container">
      {/* Sidebar */}
      <aside className="admindashboard-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <button onClick={() => navigate(`/admindashboard/${userId}`)}>Dashboard</button>
          <button className="active" onClick={() => navigate(`/managedoctor/${userId}`)}>Manage Doctors</button>
          <button onClick={() => navigate(`/managepatients/${userId}`)}>Manage Patients</button>
          <button onClick={() => navigate(`/manageappointments/${userId}`)}>Manage Appointments</button>
          <button onClick={() => navigate(`/managedocschedules/${userId}`)}>Manage Doctor Schedules</button>
          <button onClick={() => navigate(`/adminsettings/${userId}`)}>Change Password</button>
          <button onClick={() => navigate(`/login`)}>Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admindashboard-mainContent">
        <header className="admindashboard-header">
          <h1>Doctor Details</h1>
        </header>

        {/* Search Bar and Add Doctor Button */}
        <section className="mngdocs-search-section">
          <input
            type="text"
            placeholder="Search doctors by name, specialty, contact, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mngdocs-search-input"
          />
          <button onClick={handleAddDoctor} className="mngdocs-add-button">Add Doctor</button>
        </section>

        {/* Doctor Table */}
        <section className="mngdocs-stats">
          <h2>Available Doctors</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table className="mngdocs-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Contact</th>
                  <th>E-mail</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor.doctor_id}>
                      <td>{doctor.doctor_name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.phone_number || 'N/A'}</td>
                      <td>{doctor.email}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteDoctor(doctor.doctor_id)} 
                          className="mngdocs-delete-button"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No doctors found</td>
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

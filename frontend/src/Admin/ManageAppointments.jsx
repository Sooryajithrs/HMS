import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ManageDoctor.css';
import { supabase } from '../supabaseClient';

const ManageAppointments = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments and related information from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            appointment_id,
            appointment_date,
            appointment_time,
            status,
            doctor:doctors(doctor_name),
            patient:patient(patient_name)
          `);

        if (error) throw error;

        // Map over the fetched data to structure the appointments
        const appointmentsData = data.map(appointment => ({
          appointment_id: appointment.appointment_id,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          status: appointment.status || 'N/A',
          doctor_name: appointment.doctor ? appointment.doctor.doctor_name : 'N/A',
          patient_name: appointment.patient ? appointment.patient.patient_name : 'N/A',
        }));

        // Sort appointments by date and time (nearest date first)
        appointmentsData.sort((a, b) => {
          const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
          const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
          return dateA - dateB;
        });

        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
        setError("Could not load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on search term, including date and time
  const filteredAppointments = appointments.filter((appointment) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    // Convert date and time to string and match against search term
    const appointmentDate = String(appointment.appointment_date).toLowerCase();
    const appointmentTime = String(appointment.appointment_time).toLowerCase();

    return (
      appointment.doctor_name.toLowerCase().includes(lowercasedSearchTerm) ||
      appointment.patient_name.toLowerCase().includes(lowercasedSearchTerm) ||
      appointment.status.toLowerCase().includes(lowercasedSearchTerm) ||
      appointmentDate.includes(lowercasedSearchTerm) ||
      appointmentTime.includes(lowercasedSearchTerm)
    );
  });

  return (
    <div className="admindashboard-container">
      {/* Sidebar */}
      <aside className="admindashboard-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <button onClick={() => navigate(`/admindashboard/${userId}`)}>Dashboard</button>
          <button onClick={() => navigate(`/managedoctor/${userId}`)}>Manage Doctors</button>
          <button onClick={() => navigate(`/managepatients/${userId}`)}>Manage Patients</button>
          <button className="active" onClick={() => navigate(`/manageappointments/${userId}`)}>Manage Appointments</button>
          <button onClick={() => navigate(`/adminsettings/${userId}`)}>Settings</button>
          <button onClick={() => navigate(`/login`)}>Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admindashboard-mainContent">
        <header className="admindashboard-header">
          <h1>Appointment Details</h1>
        </header>

        {/* Search Bar */}
        <section className="mngdocs-search-section">
          <input
            type="text"
            placeholder="Search by doctor, patient, status, date, or time"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mngdocs-search-input"
          />
        </section>

        {/* Appointments Table */}
        <section className="mngdocs-stats">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="mngdocs-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.doctor_name}</td>
                      <td>{appointment.appointment_date}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No appointments found</td>
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

export default ManageAppointments;

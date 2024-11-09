import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Admin/AdminDashboard.css'; // You can modify this CSS if necessary
import { supabase } from '../supabaseClient';

const ScheduledAppointments = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState(''); // New state for filtering by date

  // Fetch scheduled appointments and related information from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

        const { data, error } = await supabase
          .from('appointments')
          .select(`
            appointment_id,
            appointment_date,
            appointment_time,
            status,
            doctor:doctors(doctor_name),
            patient:patient(patient_name)
          `)
          .eq('status', 'Scheduled')
          .gte('appointment_date', today); // Fetch only appointments with current or future dates

        if (error) throw error;

        // Map over the fetched data to structure the appointments
        const appointmentsData = data.map((appointment) => ({
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
        console.error('Error fetching appointments:', error.message);
        setError('Could not load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on search term and date filter
  const filteredAppointments = appointments.filter((appointment) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const appointmentDate = String(appointment.appointment_date).toLowerCase();
    const appointmentTime = String(appointment.appointment_time).toLowerCase();

    // Check if the appointment matches the search term or date filter
    const matchesSearchTerm =
      appointment.doctor_name.toLowerCase().includes(lowercasedSearchTerm) ||
      appointment.patient_name.toLowerCase().includes(lowercasedSearchTerm) ||
      appointment.status.toLowerCase().includes(lowercasedSearchTerm) ||
      appointmentDate.includes(lowercasedSearchTerm) ||
      appointmentTime.includes(lowercasedSearchTerm);

    const matchesDateFilter = dateFilter
      ? appointment.appointment_date === dateFilter // Check if appointment date matches selected date
      : true; // If no date is selected, do not filter by date

    return matchesSearchTerm && matchesDateFilter;
  });

  const handleSignOut = () => {
    navigate(`/login`);
  };

  return (
    <div className="admindashboard-container">
      {/* Sidebar */}
      <aside className="admindashboard-sidebar">
        <h2>Receptionist Dashboard</h2>
        <nav>
          <button onClick={() => navigate(`/receptionistdashboard/${userId}`)}>Dashboard</button>
          <button className="active" onClick={() => navigate(`/scheduledappointments/${userId}`)}>Scheduled Appointments</button>
          <button onClick={() => navigate(`/addpatient/${userId}`)}>Add Patient</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admindashboard-mainContent">
        <header className="admindashboard-header">
          <h1>Scheduled Appointment Details</h1>
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

        {/* Date Filter Input */}
        <section className="mngdocs-date-filter-section">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // Disable past dates
            className="mngdocs-date-filter-input"
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
                    <td colSpan="5">No scheduled appointments found</td>
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

export default ScheduledAppointments;

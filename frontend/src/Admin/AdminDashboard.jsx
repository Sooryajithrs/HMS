import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { supabase } from '../supabaseClient';

const AdminDashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state
  const [adminName, setAdminName] = useState(''); // State for admin name
  const [doctorCount, setDoctorCount] = useState(0); // State for doctor count
  const [patientCount, setPatientCount] = useState(0); // State for patient count
  const [appointmentCount, setAppointmentCount] = useState(0); // State for appointment count
  const [reportCount] = useState(10); // Set report count as a constant value

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        // Fetch admin details based on userId
        const { data: adminData, error: adminError } = await supabase
          .from('users') // Replace with the appropriate table name
          .select('username') // Replace with the correct field name
          .eq('user_id', userId)
          .single();

        if (adminError) throw adminError;

        setAdminName(adminData.username || ''); // Set admin name

        // Fetch counts
        const { count: doctorsCount } = await supabase
          .from('doctors')
          .select('*', { count: 'exact' });
        const { count: patientsCount } = await supabase
          .from('patient')
          .select('*', { count: 'exact' });
        const { count: appointmentsCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact' });
        
        setDoctorCount(doctorsCount);
        setPatientCount(patientsCount);
        setAppointmentCount(appointmentsCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, [userId]);

  const handleSignOut = () => {
    navigate(`/login`); // Redirect to login on sign out
  };

  // Navigation handlers
  const handleManageDoctors = () => {
    navigate(`/managedoctor/${userId}`);
  };

  const handleManagePatients = () => {
    navigate(`/managepatients/${userId}`);
  };

  const handleManageAppointments = () => {
    navigate(`/manageappointments/${userId}`);
  };

  const handleSettings = () => {
    navigate(`/adminsettings/${userId}`); // Example settings path
  };

  const handleManageDocSchedules = () => {
    navigate(`/managedocschedules/${userId}`);
  };

  return (
    <div className="admindashboard-container">
      <aside className="admindashboard-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <button onClick={() => navigate(`/admindashboard/${userId}`)}>Dashboard</button>
          <button onClick={handleManageDoctors}>Manage Doctors</button>
          <button onClick={handleManagePatients}>Manage Patients</button>
          <button onClick={handleManageAppointments}>Manage Appointments</button>
          <button onClick={handleManageDocSchedules}>Manage Doctor Schedules</button>
          <button onClick={handleSettings}>Change Password</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </nav>
      </aside>

      <main className="admindashboard-mainContent">
        <header className="admindashboard-header">
          <h1>Welcome {adminName || 'Admin'}</h1>
        </header>

        <section className="admindashboard-stats">
          <div className="admindashboard-statBox">
            <h3>Doctors</h3>
            <p>{doctorCount}</p>
          </div>
          <div className="admindashboard-statBox">
            <h3>Patients</h3>
            <p>{patientCount}</p>
          </div>
          <div className="admindashboard-statBox">
            <h3>Appointments</h3>
            <p>{appointmentCount}</p>
          </div>
          <div className="admindashboard-statBox">
            <h3>Reports</h3>
            <p>{reportCount}</p> {/* Display the constant report count */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

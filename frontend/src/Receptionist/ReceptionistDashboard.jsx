import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReceptionistDashboard.css'; // Create a separate CSS file if needed
import { supabase } from '../supabaseClient';

const ReceptionistDashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [receptionistName, setReceptionistName] = useState('');
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCountToday, setAppointmentCountToday] = useState(0);
  const [pendingRejectedCount, setPendingRejectedCount] = useState(0);
  const [completedAppointmentsCount, setCompletedAppointmentsCount] = useState(0);

  useEffect(() => {
    const fetchReceptionistDetails = async () => {
      try {
        // Fetch total patients count
        const { count: patientsCount } = await supabase
          .from('patient')
          .select('*', { count: 'exact' });

        setPatientCount(patientsCount);

        // Get today's date in YYYY-MM-DD format
// Get today's date in local timezone in YYYY-MM-DD format
        const today = new Date().toLocaleDateString('en-CA');

        console.log(today);

        // Fetch scheduled appointments for today
        const { count: todayAppointmentsCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact' })
          .eq('appointment_date', today)
          .eq('status', 'Scheduled'); // Assuming 'Scheduled' is the status for confirmed appointments

        setAppointmentCountToday(todayAppointmentsCount);

        // Fetch pending/rejected appointments count
        const { count: pendingRejectedAppointmentsCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact' })
          .eq('appointment_date', today)
          .in('status', ['Pending', 'Rejected']); // Assuming 'Pending' and 'Rejected' are valid statuses

        setPendingRejectedCount(pendingRejectedAppointmentsCount);

        // Fetch completed appointments count for today
        const { count: completedCount } = await supabase
          .from('appointments')
          .select('*', { count: 'exact' })
          .eq('appointment_date', today)
          .eq('status', 'Completed'); // Assuming 'Completed' is a valid status

        setCompletedAppointmentsCount(completedCount);

        // Fetch receptionist details based on userId
        const { data: receptionistData, error: receptionistError } = await supabase
          .from('users')
          .select('username')
          .eq('user_id', userId)
          .single();
        if (receptionistError) throw receptionistError;
        setReceptionistName(receptionistData.username || '');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchReceptionistDetails();
  }, [userId]);

  const handleSignOut = () => {
    navigate(`/login`);
  };

  return (
    <div className="receptionistdashboard-container">
      <aside className="receptionistdashboard-sidebar">
        <h2>Receptionist Dashboard</h2>
        <nav>
          <button onClick={() => navigate(`/receptionistdashboard/${userId}`)}>Dashboard</button>
          <button onClick={() => navigate(`/scheduledappointments/${userId}`)}>Scheduled Appointments</button>
          <button onClick={() => navigate(`/addpatient/${userId}`)}>Add Patient</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </nav>
      </aside>

      <main className="receptionistdashboard-mainContent">
        <header className="receptionistdashboard-header">
          <h1>Welcome {receptionistName || 'Receptionist'}</h1>
        </header>

        <section className="receptionistdashboard-stats">
          <div className="receptionistdashboard-statBox">
            <h3>Number Of Registered Patients</h3>
            <p>{patientCount}</p>
          </div>
          <div className="receptionistdashboard-statBox">
            <h3>Scheduled Appointments for Today</h3>
            <p>{appointmentCountToday}</p>
          </div>
          <div className="receptionistdashboard-statBox">
            <h3>Pending/Rejected Appointments for Today</h3>
            <p>{pendingRejectedCount}</p>
          </div>
          <div className="receptionistdashboard-statBox">
            <h3>Completed Appointments for Today</h3>
            <p>{completedAppointmentsCount}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReceptionistDashboard;

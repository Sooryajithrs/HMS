import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReceptionistDashboard.css'; // Create a separate CSS file if needed
import { supabase } from '../supabaseClient';

const ReceptionistDashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [receptionistName, setReceptionistName] = useState('');

  useEffect(() => {
    const fetchReceptionistDetails = async () => {
      try {
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
      } finally {
        setLoading(false);
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
      </main>
    </div>
  );
};

export default ReceptionistDashboard;

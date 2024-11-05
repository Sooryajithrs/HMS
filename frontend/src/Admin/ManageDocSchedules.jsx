import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ManageDoctor.css';
import { supabase } from '../supabaseClient';

const ManageDocSchedules = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch schedules and related doctor information from Supabase
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('schedule')
          .select(`
            schedule_id,
            day_of_week,
            start_time,
            end_time,
            break_start_time,
            break_end_time,
            doctor:doctors(doctor_name)
          `);

        if (error) throw error;

        // Map over the fetched data to structure the schedules
        const schedulesData = data.map(schedule => ({
          schedule_id: schedule.schedule_id,
          day_of_week: schedule.day_of_week,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          break_start_time: schedule.break_start_time || 'N/A',
          break_end_time: schedule.break_end_time || 'N/A',
          doctor_name: schedule.doctor ? schedule.doctor.doctor_name : 'N/A',
        }));

        setSchedules(schedulesData);
      } catch (error) {
        console.error("Error fetching schedules:", error.message);
        setError("Could not load schedules. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Function to delete a schedule
  const handleDeleteSchedule = async (scheduleId) => {
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('schedule_id', scheduleId);

    if (error) {
      console.error("Error deleting schedule:", error.message);
      alert("Failed to delete schedule. Please try again.");
    } else {
      setSchedules(schedules.filter(schedule => schedule.schedule_id !== scheduleId));
      alert("Schedule successfully deleted.");
    }
  };

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter((schedule) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      schedule.doctor_name.toLowerCase().includes(lowercasedSearchTerm) ||
      schedule.day_of_week.toLowerCase().includes(lowercasedSearchTerm) ||
      String(schedule.start_time).toLowerCase().includes(lowercasedSearchTerm) ||
      String(schedule.end_time).toLowerCase().includes(lowercasedSearchTerm)
    );
  });

  // Handle navigation to add schedule page
  const handleAddSchedule = () => {
    navigate(`/addschedule`); // Adjust the route based on your application structure
  };

  return (
    <div className="admindashboard-container">
      {/* Sidebar */}
      <aside className="admindashboard-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <button onClick={() => navigate(`/admindashboard/${userId}`)}>Dashboard</button>
          <button onClick={() => navigate(`/managedoctor/${userId}`)}>Manage Doctors</button>
          <button onClick={() => navigate(`/managepatients/${userId}`)}>Manage Patients</button>
          <button onClick={() => navigate(`/manageappointments/${userId}`)}>Manage Appointments</button>
          <button className="active" onClick={() => navigate(`/managedocschedules/${userId}`)}>Manage Doctor Schedules</button>
          <button onClick={() => navigate(`/adminsettings/${userId}`)}>Change Password</button>
          <button onClick={() => navigate(`/login`)}>Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admindashboard-mainContent">
        <header className="admindashboard-header">
          <h1>Doctor Schedules</h1>
        </header>

        {/* Search Bar and Add Schedule Button */}
        <section className="mngdocs-search-section">
          <input
            type="text"
            placeholder="Search by doctor, day, start time, or end time"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mngdocs-search-input"
          />
          <button onClick={handleAddSchedule} className="mngdocs-add-button">Add Schedule</button>
        </section>

        {/* Schedules Table */}
        <section className="mngdocs-stats">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="mngdocs-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Break Start</th>
                  <th>Break End</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule, index) => (
                    <tr key={index}>
                      <td>{schedule.doctor_name}</td>
                      <td>{schedule.day_of_week}</td>
                      <td>{schedule.start_time}</td>
                      <td>{schedule.end_time}</td>
                      <td>{schedule.break_start_time}</td>
                      <td>{schedule.break_end_time}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.schedule_id)}
                          className="mngdocs-delete-button"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No schedules found</td>
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

export default ManageDocSchedules;

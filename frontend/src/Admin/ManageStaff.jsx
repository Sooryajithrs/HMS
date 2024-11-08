import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ManageDoctor.css';
import { supabase } from '../supabaseClient';

const ManageStaff = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch staff data from Supabase
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('staffs')
          .select('staff_id, staff_name, role, phone_number');

        if (error) {
          console.error('Error fetching data:', error);
          throw error;
        }

        setStaffs(data);

      } catch (error) {
        console.error('Error fetching staffs:', error.message);
        setError('Could not load staff members. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  // Log staff data before filtering to ensure data is loaded
  
  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.staff_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.phone_number && staff.phone_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Log filtered staff data for debugging
  
  // Navigate to add staff page
  const handleAddStaff = () => {
    navigate(`/addstaff`);
  };

  // Handle delete staff
  const handleDeleteStaff = async (staffId) => {
    const confirmed = window.confirm("Are you sure you want to delete this staff member?");
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('staffs')
          .delete()
          .eq('staff_id', staffId);

        if (error) throw error;

        // Update the staff list in state
        setStaffs(staffs.filter((staff) => staff.staff_id !== staffId));

        alert("Staff member deleted successfully.");
      } catch (error) {
        console.error('Error deleting staff member:', error.message);
        setError('Could not delete staff member. Please try again.');
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
          <button onClick={() => navigate(`/managedoctor/${userId}`)}>Manage Doctors</button>
          <button onClick={() => navigate(`/managepatients/${userId}`)}>Manage Patients</button>
          <button onClick={() => navigate(`/manageappointments/${userId}`)}>Manage Appointments</button>
          <button onClick={() => navigate(`/managedocschedules/${userId}`)}>Manage Doctor Schedules</button>
          <button className="active" onClick={() => navigate(`/managestaff/${userId}`)}>Manage Staffs</button>
          <button onClick={() => navigate(`/adminsettings/${userId}`)}>Change Password</button>
          <button onClick={() => navigate(`/login`)}>Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admindashboard-mainContent">
        <header className="admindashboard-header">
          <h1>Staff Details</h1>
        </header>

        {/* Search Bar and Add Staff Button */}
        <section className="mngdocs-search-section">
          <input
            type="text"
            placeholder="Search staff by name, role, or contact"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mngdocs-search-input"
          />
          <button onClick={handleAddStaff} className="mngdocs-add-button">Add Staff</button>
        </section>

        {/* Staff Table */}
        <section className="mngdocs-stats">
          <h2>Available Staff</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table className="mngdocs-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaffs.length > 0 ? (
                  filteredStaffs.map((staff) => (
                    <tr key={staff.staff_id}>
                      <td>{staff.staff_name}</td>
                      <td>{staff.role}</td>
                      <td>{staff.phone_number || 'N/A'}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteStaff(staff.staff_id)} 
                          className="mngdocs-delete-button"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No staff members found</td>
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

export default ManageStaff;

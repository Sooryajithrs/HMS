import React from 'react';
import './MngPatients.css'; // Add the CSS provided below in this file

function ManagePatients() {
  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Hospital Admin</h2>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/manage-doctors">Manage Doctors</a>
          <a href="#" className="active">Manage Patients</a>
          <a href="/reports">Reports</a>
          <a href="/settings">Settings</a>
          <a href="/logout">Sign Out</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>Patient Details</h1>
          {/*<div className="user-info">
            <p>Welcome, Admin</p>
            <a href="/logout">Logout</a>
          </div>*/}
        </header>

        <section className="patient-details">
          <h2>Registered Patients</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Smith</td>
                <td>45</td>
                <td>Male</td>
                <td>123-456-7890</td>
                <td>Admitted</td>
              </tr>
              <tr>
                <td>Mary Johnson</td>
                <td>30</td>
                <td>Female</td>
                <td>987-654-3210</td>
                <td>Discharged</td>
              </tr>
              <tr>
                <td>James Brown</td>
                <td>60</td>
                <td>Male</td>
                <td>555-123-4567</td>
                <td>In Surgery</td>
              </tr>
              <tr>
                <td>Linda Wilson</td>
                <td>25</td>
                <td>Female</td>
                <td>444-789-1234</td>
                <td>Under Observation</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default ManagePatients;

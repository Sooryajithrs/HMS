import React from 'react';
import './MngDoc.css'; // Make sure to add the CSS provided below in this file

function App() {
  return (
    <div className="mngdocs-container">
      {/* Sidebar */}
      <aside className="mngdocs-sidebar">
        <h2>Hospital Admin</h2>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="#" className="mngdocs-active">Manage Doctors</a>
          <a href="/patients">Manage Patients</a>
          <a href="/reports">Reports</a>
          <a href="/settings">Settings</a>
          <a href="/logout">Sign Out</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="mngdocs-main-content">
        <header className="mngdocs-header">
          <h1>Doctor Details</h1>
          {/*<div className="mngdocs-user-info">
            <p>Welcome, Admin</p>
            <a href="/logout">Logout</a>
          </div>*/}
        </header>

        <section className="mngdocs-doctor-details">
          <h2>Available Doctors</h2>
          <table className="mngdocs-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dr. John Doe</td>
                <td>Cardiologist</td>
                <td>123-456-7890</td>
                <td>Available</td>
              </tr>
              <tr>
                <td>Dr. Sarah Smith</td>
                <td>Dermatologist</td>
                <td>987-654-3210</td>
                <td>In Surgery</td>
              </tr>
              <tr>
                <td>Dr. Emily Johnson</td>
                <td>Pediatrician</td>
                <td>555-123-4567</td>
                <td>Available</td>
              </tr>
              <tr>
                <td>Dr. Michael Brown</td>
                <td>Neurologist</td>
                <td>444-789-1234</td>
                <td>On Leave</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;

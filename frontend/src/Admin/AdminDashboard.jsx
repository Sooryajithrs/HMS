import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

const App = () => (
  <div className="container">
    <Sidebar />
    <main className="mainContent">
      <Header />
      <Stats />
    </main>
  </div>
);

const Sidebar = () => (
  <aside className="sidebar">
    <h2>Hospital Admin</h2>
    <nav>
      <a href="#" className="active">Dashboard</a>
      <a href="#">Manage Doctors</a>
      <a href="#">Manage Patients</a>
      <a href="#">Reports</a>
      <a href="#">Settings</a>
      <a href="#">Sign Out</a>
    </nav>
  </aside>
);

const Header = () => (
  <header className="header">
    <h1>Dashboard</h1>
    {/*<div className="userInfo">
      <p>Welcome, Admin</p>
      <a href="#">Logout</a>
    </div>*/}
  </header>
);

const Stats = () => (
  <section className="stats">
    <div className="statBox">
      <h3>Doctors</h3>
      <p>25</p>
    </div>
    <div className="statBox">
      <h3>Patients</h3>
      <p>150</p>
    </div>
    <div className="statBox">
      <h3>Appointments</h3>
      <p>35</p>
    </div>
    <div className="statBox">
      <h3>Reports</h3>
      <p>12</p>
    </div>
  </section>
);

{/*const RecentActivitiesTable = () => (
  <section className="content">
    <h2>Recent Activities</h2>
    <table>
      <thead>
        <tr>
          <th>Activity</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>New patient added</td>
          <td>2024-11-04</td>
          <td>Completed</td>
        </tr>
        <tr>
          <td>Appointment scheduled</td>
          <td>2024-11-03</td>
          <td>Pending</td>
        </tr>
        <tr>
          <td>Report generated</td>
          <td>2024-11-02</td>
          <td>Completed</td>
        </tr>
      </tbody>
    </table>
  </section>
);*/}

export default App;



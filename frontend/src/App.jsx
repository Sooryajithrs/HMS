// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Forgotpassword from './components/Forgotpassword';
import { supabase } from './supabaseClient'; 
import DoctorDashboard from './Doctor/Doctordashboard';
import PatientDashboard from './Patient/PatientDashboard';
import DocSettings from './Doctor/DocSettings';
import PatientSettings from './Patient/Patientsettings';
import DocSchedule from './Doctor/DocSchedule';
import DocViewAppointment from './Doctor/DocViewAppointments';
import MakeAppointment from './Patient/MakeAppointment';
import ViewAppointments from './Patient/ViewAppointments';
import DocViewAppointments from './Doctor/DocViewAppointments';
import DocDiagnosis from './Doctor/DocDiagnosis';
import DiagnosisPage from './Doctor/DiagnosisPage';
import DocViewPatients from './Doctor/DocViewPatients';
import PatientMedHistory from './Patient/PatientMedHistory';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<Forgotpassword />} />
                <Route path="/doctordashboard/:userId" element={<DoctorDashboard />} />
                <Route path="/patientdashboard/:userId" element={<PatientDashboard />} />
                <Route path="/docsettings/:userId" element={<DocSettings />} /> 
                <Route path="/patientsettings/:userId" element={<PatientSettings />} /> 
                <Route path="/makeappointment/:userId/:patientId" element={<MakeAppointment />} />
                <Route path="/viewappointments/:patientId" element={<ViewAppointments />} />
                <Route path="/patientmedhistory/:patientId" element={<PatientMedHistory />} />
                <Route path="/docschedule/:userId/:doctorId" element={<DocSchedule />} /> 
                <Route path="/docviewappointments/:userId/:doctorId" element={<DocViewAppointments />} /> 
                <Route path="/docdiagnosis/:userId/:doctorId" element={<DocDiagnosis />} />
                <Route path="/docviewpatients/:doctorId" element={<DocViewPatients />} />
                <Route path="/diagnosispage/:patientId/:doctorId/:appointmentId/:userId" element={<DiagnosisPage/>} />
            </Routes>
        </Router>
    );
}

export default App;

import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Doctordashboard.css';
import { supabase } from '../supabaseClient';

const DoctorDashboard = () => {
    const { userId } = useParams(); // Get userId from the URL parameters
    const navigate = useNavigate(); // Initialize navigate for redirection
    const [doctorName, setDoctorName] = useState(''); // State for doctor's name
    const [specialization, setSpecialization] = useState(''); // State for specialization
    const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
    const [date, setDate] = useState(new Date()); // State for selected date
    const [loading, setLoading] = useState(true); // State for loading status
    const [appointmentCount, setAppointmentCount] = useState(0); // State for appointment count
    const [isEditing, setIsEditing] = useState(false); // State for edit mode
    const [doctorId, setDoctorId] = useState(null); // State for doctor_id
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    useEffect(() => {
        const fetchDoctorDetailsAndAppointments = async () => {
            try {
                // Fetch doctor details based on userId
                const { data: doctorData, error: doctorError } = await supabase
                    .from('doctors')
                    .select('doctor_name, specialization, phone_number, doctor_id')
                    .eq('user_id', userId)
                    .single();

                if (doctorError) throw doctorError;

                // Set doctor details
                setDoctorName(doctorData.doctor_name);
                setSpecialization(doctorData.specialization || '');
                setPhoneNumber(doctorData.phone_number || '');
                setDoctorId(doctorData.doctor_id); // Store doctor_id for later use

                // Fetch appointment count for today using the doctor_id
                const today = new Date();
                const formattedToday = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

                console.log('doctorId:', doctorData.doctor_id);
                console.log('today_date:', formattedToday);
                
                const { count, error: appointmentError } = await supabase
                    .from('appointments')
                    .select('appointment_id', { count: 'exact' })
                    .eq('doctor_id', doctorData.doctor_id)
                    .eq('appointment_date', formattedToday); // Use formatted date
                
                if (appointmentError) throw appointmentError;
                setAppointmentCount(count);
            } catch (error) {
                setErrorMessage(`Error fetching data: ${error.message}`); // Set error message
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetailsAndAppointments();
    }, [userId]);

    const handleEdit = () => {
        setIsEditing(true); // Enable edit mode
    };

    const handleSave = async () => {
        setErrorMessage(''); // Reset error message
        // Validate inputs
        if (!doctorName || !specialization || !phoneNumber) {
            alert('Please fill in all fields.');
            return;
        }

        // Check if the phone number is exactly 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            alert('Phone number must be exactly 10 digits.');
            return;
        }

        try {
            // Fetch user_id from users table based on userId
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('user_id')
                .eq('user_id', userId) // Assuming userId corresponds to user_id
                .single();

            if (userError) throw userError;

            // Prepare data for upsert
            const doctorData = {
                doctor_name: doctorName,
                specialization,
                phone_number: phoneNumber,
                user_id: userData.user_id, // Ensure user_id is included
            };

            if (doctorId) {
                // Update existing doctor details
                const { data, error } = await supabase
                    .from('doctors')
                    .upsert({
                        ...doctorData,
                        doctor_id: doctorId, // Include doctor_id for update
                    });

                if (error) throw error;

                alert('Doctor data updated successfully!');
                console.log('Profile updated successfully:', data);
            } else {
                // Insert new doctor details
                const { data, error } = await supabase
                    .from('doctors')
                    .insert(doctorData);

                if (error) throw error;

                alert('Doctor data saved successfully!');
                console.log('New doctor profile created successfully:', data);
            }

            setIsEditing(false); // Exit edit mode
        } catch (error) {
            setErrorMessage(`Error saving data: ${error.message}`); // Set error message
        }
    };

    const handleSignOut = () => {
        navigate('/login'); // Redirect to login page on sign out
    };

    const handleSettings = () => {
        navigate(`/docsettings/${userId}`); // Pass userId to settings
    };

    const handleSchedule = () => {
        navigate(`/docschedule/${userId}/${doctorId}`); // Pass userId to schedule
    };

    const handleAppointments = () => {
        navigate(`/docviewappointments/${userId}/${doctorId}`); // Pass userId to schedule
    };

    const handleDiagnosis = () => {
        navigate(`/docdiagnosis/${userId}/${doctorId}`); // Pass userId to schedule
    };

    const handleViewPatients = () => {
        navigate(`/docviewpatients/${doctorId}`); 
    };

    const handleProfile = () => {
        navigate(`/doctordashboard/${userId}`); 
    };

    if (loading) return <p>Loading...</p>; // You can replace this with a spinner

    return (
        <div className="doctor-dashboard-grommet">
            <div className="doctor-dashboard-grid">
                <aside className="doctor-dashboard-sidebar">
                <button className="doctor-dashboard-sidebar-button" onClick={handleProfile}>Profile</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleAppointments}>View Appointments</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleDiagnosis}>Diagnosis</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleViewPatients}>View Patients</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleSchedule}>Edit Schedule</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleSettings}>Settings</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleSignOut}>Sign Out</button>
                </aside>
                
                <main className="doctor-dashboard-main">
                    <h1 className="doctor-dashboard-welcome-heading">Welcome {doctorName || 'New Doctor'}</h1>
                    <div className="doctor-dashboard-content-container">
                        <div className="doctor-dashboard-dashboard-content">
                            <h2>Profile Information</h2>
                            <label>
                                Doctor Name:
                                <input 
                                    type="text" 
                                    value={doctorName} 
                                    onChange={(e) => setDoctorName(e.target.value)} 
                                    readOnly={!isEditing} // Toggle read-only based on editing state
                                />
                            </label>
                            <label>
                                Specialization:
                                <input 
                                    type="text" 
                                    value={specialization} 
                                    onChange={(e) => setSpecialization(e.target.value)} 
                                    readOnly={!isEditing} // Toggle read-only based on editing state
                                />
                            </label>
                            <label>
                                Phone Number:
                                <input 
                                    type="tel" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                    readOnly={!isEditing} // Toggle read-only based on editing state
                                />
                            </label>
                            <div className="doctor-dashboard-button-container">
                                {!isEditing ? (
                                    <button onClick={handleEdit}>Edit</button> // Enable edit mode
                                ) : (
                                    <button onClick={handleSave}>Save</button> // Save changes
                                )}
                            </div>
                        </div>
                        <div className="doctor-dashboard-calendar-appointments-container">
                            <div className="doctor-dashboard-calendar-container">
                                <Calendar onChange={setDate} value={date} />
                            </div>
                            <div className="doctor-dashboard-appointment-container">
                                <h2>Number of Appointment Requests Today</h2>
                                <p className="doctor-dashboard-count">{appointmentCount}</p> 
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DoctorDashboard;

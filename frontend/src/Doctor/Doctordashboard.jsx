import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Doctordashboard.css';
import { supabase } from '../supabaseClient';

const DoctorDashboard = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [doctorName, setDoctorName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [appointmentCount, setAppointmentCount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [doctorId, setDoctorId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [noDoctorData, setNoDoctorData] = useState(false); // New state for no doctor data

    useEffect(() => {
        const fetchDoctorDetailsAndAppointments = async () => {
            try {
                const { data: doctorData, error: doctorError } = await supabase
                    .from('doctors')
                    .select('doctor_name, specialization, phone_number, doctor_id')
                    .eq('user_id', userId)
                    .single();

                if (doctorError || !doctorData) {
                    setNoDoctorData(true); // Set noDoctorData to true if no data found
                    throw doctorError || new Error('No doctor data found.');
                }

                setDoctorName(doctorData.doctor_name);
                setSpecialization(doctorData.specialization || '');
                setPhoneNumber(doctorData.phone_number || '');
                setDoctorId(doctorData.doctor_id);

                console.log('Current Date:', formattedToday);

                const today = new Date();
                const formattedToday = today.toISOString().split('T')[0];

                const { count, error: appointmentError } = await supabase
                    .from('appointments')
                    .select('appointment_id', { count: 'exact' })
                    .eq('doctor_id', doctorData.doctor_id)
                    .eq('appointment_date', formattedToday);
                
                if (appointmentError) throw appointmentError;
                setAppointmentCount(count);
            } catch (error) {
                setErrorMessage(`Error fetching data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetailsAndAppointments();
    }, [userId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        setErrorMessage('');

        // Check if all fields are filled
        if (!doctorName || !specialization || !phoneNumber) {
            alert('Please fill in all fields.');
            return;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            alert('Contact number must be exactly 10 digits.');
            return;
        }

        try {
            const doctorData = {
                doctor_name: doctorName,
                specialization,
                phone_number: phoneNumber,
                user_id: userId, // Use the userId from the route params
            };

            if (doctorId) {
                // Update existing doctor
                const { error } = await supabase
                    .from('doctors')
                    .update(doctorData)
                    .eq('doctor_id', doctorId);

                if (error) throw error;

                alert('Doctor data updated successfully!');
            } else {
                // Insert new doctor
                const { data, error } = await supabase
                    .from('doctors')
                    .insert(doctorData);

                if (error) throw error;

                alert('New doctor profile created successfully!');
            }

            setIsEditing(false);
        } catch (error) {
            setErrorMessage(`Error saving data: ${error.message}`);
        }
    };

    const handleSignOut = () => {
        navigate('/login');
    };

    const handleSettings = () => {
        if (noDoctorData) {
            alert('Please update your profile.'); // Alert if no doctor data found
        } else {
            navigate(`/docsettings/${userId}`);
        }
    };

    const handleSchedule = () => {
        if (noDoctorData) {
            alert('Please update your profile.'); // Alert if no doctor data found
        } else {
            navigate(`/docschedule/${userId}/${doctorId}`);
        }
    };

    const handleAppointments = () => {
        if (noDoctorData) {
            alert('Please update your profile.'); // Alert if no doctor data found
        } else {
            navigate(`/docviewappointments/${userId}/${doctorId}`);
        }
    };

    const handleDiagnosis = () => {
        if (noDoctorData) {
            alert('Please update your profile.'); // Alert if no doctor data found
        } else {
            navigate(`/docdiagnosis/${userId}/${doctorId}`);
        }
    };

    const handleViewPatients = () => {
        if (noDoctorData) {
            alert('Please update your profile.'); // Alert if no doctor data found
        } else {
            navigate(`/docviewpatients/${doctorId}`);
        }
    };

    const handleProfile = () => {
        if (noDoctorData) {
            alert('Please update your profile.'); // Alert if no doctor data found
        } else {
            navigate(`/doctordashboard/${userId}`);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="doctor-dashboard-grommet">
            <div className="doctor-dashboard-grid">
                <aside className="doctor-dashboard-sidebar">
                    <button className="doctor-dashboard-sidebar-button" onClick={handleProfile}>Profile</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleAppointments}>View Appointments</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleDiagnosis}>Diagnosis</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleViewPatients}>View Patients</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleSchedule}>Edit Schedule</button>
                    <button className="doctor-dashboard-sidebar-button" onClick={handleSettings}>Change Password</button>
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
                                    readOnly={!isEditing}
                                />
                            </label>
                            <label>
                                Specialization:
                                <input 
                                    type="text" 
                                    value={specialization} 
                                    onChange={(e) => setSpecialization(e.target.value)} 
                                    readOnly={!isEditing}
                                />
                            </label>
                            <label>
                                Phone Number:
                                <input 
                                    type="tel" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                    readOnly={!isEditing}
                                />
                            </label>
                            <div className="doctor-dashboard-button-container">
                                {!isEditing ? (
                                    <button onClick={handleEdit}>Edit</button>
                                ) : (
                                    <button onClick={handleSave}>Save</button>
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

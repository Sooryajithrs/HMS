import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useParams, useNavigate } from 'react-router-dom';
import './Patientdashboard.css';
import { supabase } from '../supabaseClient';

const PatientDashboard = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [patientName, setPatientName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState(null);
    const [address, setAddress] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');
    const [patientId, setPatientId] = useState(null);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const { data: patientData, error: patientError } = await supabase
                    .from('patient')
                    .select('patient_id, patient_name, phone_number, dob, gender, address')
                    .eq('user_id', userId)
                    .single();

                console.log("PatientData:", patientData);

                if (patientError) {
                    // Handle the error appropriately
                    if (patientError.code === 'PGRST102') {
                        alert('No patient data found. Please update your profile.');
                    } else {
                        setErrorMessage(`Error fetching data: ${patientError.message}`);
                    }
                    return;
                }

                // If data is retrieved successfully
                if (!patientData) {
                    alert('No patient data found. Please update your profile.');
                    return;
                }

                setPatientName(patientData.patient_name);
                setContactNumber(patientData.phone_number || '');
                setDob(patientData.dob || '');
                setGender(patientData.gender || null);
                setAddress(patientData.address || '');
                setPatientId(patientData.patient_id);

            } catch (error) {
                setErrorMessage(`Error fetching data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientDetails();
    }, [userId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        setErrorMessage('');
        // Check if all fields are filled
        if (!patientName || !contactNumber || !dob || !address) {
            alert('Please fill in all fields.');
            return;
        }

        // Check if the contact number is exactly 10 digits
        if (!/^\d{10}$/.test(contactNumber)) {
            alert('Contact number must be exactly 10 digits.');
            return;
        }

        try {
            const patientData = {
                patient_name: patientName,
                phone_number: contactNumber,
                dob,
                gender,
                address,
            };

            if (patientId) {
                const { error } = await supabase
                    .from('patient')
                    .update(patientData)
                    .eq('patient_id', patientId);

                if (error) throw error;

                alert('Patient data updated successfully!');
            } else {
                const { data, error } = await supabase
                    .from('patient')
                    .insert({ ...patientData, user_id: userId });

                if (error) throw error;

                alert('New patient profile created successfully!');
                setPatientId(data[0].patient_id);
            }

            setIsEditing(false);
        } catch (error) {
            setErrorMessage(`Error saving data: ${error.message}`);
        }
    };

    const handleSignOut = () => {
        navigate('/login'); // Redirect to login page on sign out
    };

    const handleSettings = () => {
        if (!patientId) {
            alert('Please update your profile first.');
            return;
        }
        navigate(`/patientsettings/${userId}`); // Pass userId to settings
    };

    const handleAppointment = () => {
        if (!patientId) {
            alert('Please update your profile first.');
            return;
        }
        navigate(`/makeappointment/${userId}/${patientId}`); // Pass userId to appointment
    };

    const handleViewAppointment = () => {
        if (!patientId) {
            alert('Please update your profile first.');
            return;
        }
        navigate(`/viewappointments/${patientId}`); 
    };

    const handleViewMedHistory = () => {
        if (!patientId) {
            alert('Please update your profile first.');
            return;
        }
        navigate(`/patientmedhistory/${patientId}`); 
    };

    const handleProfile = () => {
        if (!patientId) {
            alert('Please update your profile first.');
            return;
        }
        navigate(`/patientdashboard/${userId}`); 
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="patientdashboard-grommet">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="patientdashboard-grid">
                <aside className="patientdashboard-sidebar">
                    <button className="patientdashboard-sidebar-button" onClick={handleProfile}>Profile</button>
                    <button className="patientdashboard-sidebar-button" onClick={handleViewMedHistory}>View Medical History</button>
                    <button className="patientdashboard-sidebar-button" onClick={handleViewAppointment}>View Appointments</button>
                    <button className="patientdashboard-sidebar-button" onClick={handleAppointment}>Make Appointments</button>
                    <button className="patientdashboard-sidebar-button" onClick={handleSettings}>Change Password</button>
                    <button className="patientdashboard-sidebar-button" onClick={handleSignOut}>Sign Out</button>
                </aside>
                
                <main className="patientdashboard-main">
                    <h1 className="patientdashboard-welcome-heading">Welcome {patientName || 'New Patient'}</h1>
                    <div className="patientdashboard-content-container">
                        <div className="patientdashboard-dashboard-content">
                            <h2>Profile Information</h2>
                            <label>
                                Patient Name:
                                <input 
                                    type="text" 
                                    value={patientName} 
                                    onChange={(e) => setPatientName(e.target.value)} 
                                    readOnly={!isEditing} 
                                />
                            </label>
                            <label>
                                Contact Number:
                                <input 
                                    type="tel" 
                                    value={contactNumber} 
                                    onChange={(e) => setContactNumber(e.target.value)} 
                                    readOnly={!isEditing} 
                                />
                            </label>
                            <label>
                                Date of Birth:
                                <input 
                                    type="date" 
                                    value={dob} 
                                    onChange={(e) => setDob(e.target.value)} 
                                    readOnly={!isEditing} 
                                />
                            </label>
                            <label>
                                Gender:
                                <select 
                                    className="patientdashboard-gender-select"
                                    value={gender === null ? '' : gender}
                                    onChange={(e) => setGender(e.target.value || null)} 
                                    disabled={!isEditing}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </label>
                            <label>
                                Address:
                                <input 
                                    type="text" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    readOnly={!isEditing} 
                                />
                            </label>
                            <div className="patientdashboard-button-container">
                                {!isEditing ? (
                                    <button onClick={handleEdit}>Edit</button>
                                ) : (
                                    <button onClick={handleSave}>Save</button>
                                )}
                            </div>
                        </div>
                        <div className="patientdashboard-calendar-container">
                            <Calendar value={date} onChange={setDate} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PatientDashboard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../supabaseClient';
import './DocDiagnosis.css';

const DocDiagnosis = () => {
    const { userId, doctorId } = useParams();
    const navigate = useNavigate(); // Initialize navigate function
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]); // State to hold patient data
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    // Fetch appointments based on doctor ID
    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctorId); // Filter by doctor ID

        if (error) {
            console.error('Error fetching appointments:', error);
        } else {
            // Filter out rejected appointments
            const validAppointments = data.filter(appointment => appointment.status.toLowerCase() !== 'rejected');
            setAppointments(validAppointments);
            setFilteredAppointments(validAppointments); // Set filtered appointments to all valid ones initially
            fetchPatients(validAppointments); // Fetch patient names based on valid appointments
        }
    };

    // Fetch patient names based on appointment data
    const fetchPatients = async (appointments) => {
        const patientIds = appointments.map(appointment => appointment.patient_id);
        const { data, error } = await supabase
            .from('patient')
            .select('patient_id, patient_name')
            .in('patient_id', patientIds); // Get patient names based on their IDs

        if (error) {
            console.error('Error fetching patients:', error);
        } else {
            setPatients(data);
        }
    };

    // Filter appointments based on selected date
    const filterAppointments = (date) => {
        console.log('Filtering appointments for date:', date);

        if (!date) {
            setFilteredAppointments(appointments); // Reset to all appointments if no date is selected
            return;
        }

        // Format date to YYYY-MM-DD directly without time zone conversion
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`; // Construct YYYY-MM-DD format

        console.log('Formatted Date for filtering:', formattedDate);

        // Filter appointments that are scheduled and match the selected date
        const filtered = appointments.filter(appointment => {
            console.log(`Checking appointment: ${appointment.appointment_date}, status: ${appointment.status}`);
            return (
                appointment.appointment_date === formattedDate && 
                appointment.status.toLowerCase() === 'scheduled' // Normalize status comparison
            );
        });

        console.log('Filtered Appointments:', filtered);
        setFilteredAppointments(filtered); // Update state with filtered results
    };

    // Sort appointments based on date closer to current date
    const sortAppointmentsByDate = (appointmentsToSort) => {
        return appointmentsToSort.sort((a, b) => {
            const dateA = new Date(a.appointment_date);
            const dateB = new Date(b.appointment_date);
            return dateA - dateB; // Sort in ascending order (closer to current date first)
        });
    };

    // Fetch appointments on component mount
    useEffect(() => {
        fetchAppointments(); // Fetch appointments on component mount
    }, [doctorId]); // Dependency array includes doctorId

    // Log userId and doctorId for debugging
    useEffect(() => {
        console.log("User ID:", userId);
        console.log("Doctor ID:", doctorId);
    }, [userId, doctorId]);

    return (
        <div className="DocDiagnosis-container">
            <div className="DocDiagnosis-panel">
                <label className="DocDiagnosis-date-label">Appointment Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                        setSelectedDate(date);
                        filterAppointments(date); // Filter appointments based on the selected date
                    }}
                    className="DocDiagnosis-date-input"
                    dateFormat="yyyy-MM-dd"
                />
                <table className="DocDiagnosis-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Appointment Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortAppointmentsByDate(filteredAppointments).length > 0 ? (
                            sortAppointmentsByDate(filteredAppointments).map((appointment) => {
                                // Find patient name from the fetched patients array
                                const patient = patients.find(p => p.patient_id === appointment.patient_id);
                                return (
                                    <tr key={appointment.appointment_id}>
                                        <td>{patient ? patient.patient_name : 'Unknown'}</td>
                                        <td>{appointment.appointment_date}</td>
                                        <td>{appointment.appointment_time}</td>
                                        <td>
                                            <button 
                                                className="DocDiagnosis-action-button" 
                                                onClick={() => {
                                                    // Navigate to the DiagnosisPage with patient_id and doctorId
                                                    navigate(`/diagnosispage/${appointment.patient_id}/${doctorId}/${appointment.appointment_id}/${userId}`);
                                                }}
                                            >
                                                Diagnose
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4">No scheduled appointments for the selected date.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocDiagnosis;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ViewAppointments.css';

const ViewAppointments = () => {
    const { patientId } = useParams(); // Get the patientId from URL parameters
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchAppointments = async () => {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('appointment_id, appointment_date, appointment_time, status, doctors(doctor_name)') // Include doctor_name
                .eq('patient_id', patientId);

            if (error) throw error;
            setAppointments(data);
        } catch (error) {
            setErrorMessage(`Error fetching appointments: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [patientId]);

    const handleCancelAppointment = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                const { error } = await supabase
                    .from('appointments')
                    .delete() // Delete the appointment
                    .eq('appointment_id', appointmentId);

                if (error) throw error;

                alert('Appointment cancelled successfully!');
                // Refresh appointments after cancellation
                fetchAppointments();
            } catch (error) {
                alert(`Error cancelling appointment: ${error.message}`);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (errorMessage) return <p>{errorMessage}</p>;

    return (
        <div className="view-appointments-container">
            <h2>Your Appointments</h2>
            <table className="appointments-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Doctor Name</th> {/* Updated to show Doctor Name */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <tr key={appointment.appointment_id}>
                                <td>{appointment.appointment_date}</td>
                                <td>{appointment.appointment_time}</td>
                                <td>{appointment.status || 'Pending'}</td>
                                <td>{appointment.doctors?.doctor_name || 'Unknown'}</td> {/* Display Doctor Name */}
                                <td>
                                    <button onClick={() => handleCancelAppointment(appointment.appointment_id)}>Cancel</button>
                                    {/* Add more action buttons as needed */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No appointments found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ViewAppointments;

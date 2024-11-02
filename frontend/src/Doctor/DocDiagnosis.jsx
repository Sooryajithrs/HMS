import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../supabaseClient';
import './DocDiagnosis.css';

const DocDiagnosis = () => {
    const { userId, doctorId } = useParams();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctorId);

        if (error) {
            console.error('Error fetching appointments:', error);
        } else {
            const validAppointments = data.filter(
                appointment => appointment.status.toLowerCase() === 'scheduled'
            );
            setAppointments(validAppointments);
            setFilteredAppointments(validAppointments);
            fetchPatients(validAppointments);
        }
    };

    const fetchPatients = async (appointments) => {
        const patientIds = appointments.map(appointment => appointment.patient_id);
        const { data, error } = await supabase
            .from('patient')
            .select('patient_id, patient_name')
            .in('patient_id', patientIds);

        if (error) {
            console.error('Error fetching patients:', error);
        } else {
            setPatients(data);
        }
    };

    const filterAppointmentsByDate = (appointments, date) => {
        if (!date) return appointments;

        // Add one day to the selected date for comparison
        const dateWithOffset = new Date(date);
        dateWithOffset.setDate(dateWithOffset.getDate() + 1);
        const formattedSelectedDate = dateWithOffset.toISOString().split('T')[0];
        
        console.log('Formatted selected date with offset:', formattedSelectedDate);

        const filteredAppointments = appointments.filter(appointment => {
            const formattedAppointmentDate = appointment.appointment_date; // Ensure this is in the format YYYY-MM-DD
            console.log('Comparing:', formattedAppointmentDate, 'with', formattedSelectedDate);
            
            // Compare formatted dates directly as strings
            return formattedAppointmentDate === formattedSelectedDate && appointment.status.toLowerCase() === 'scheduled';
        });

        console.log('Filtered appointments for selected date:', filteredAppointments);
        return filteredAppointments;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const filtered = filterAppointmentsByDate(appointments, date);
        setFilteredAppointments(filtered);
    };

    const sortAppointmentsByDate = (appointmentsToSort) => {
        const sorted = [...appointmentsToSort].sort((a, b) => {
            const dateA = new Date(a.appointment_date);
            const dateB = new Date(b.appointment_date);
            return dateA - dateB;
        });
        console.log('Sorted appointments:', sorted);
        return sorted;
    };

    useEffect(() => {
        fetchAppointments();
    }, [doctorId]);

    return (
        <div className="DocDiagnosis-container">
            <div className="DocDiagnosis-panel">
                <label className="DocDiagnosis-date-label">Appointment Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
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
                                const patient = patients.find(p => p.patient_id === appointment.patient_id);
                                return (
                                    <tr key={appointment.appointment_id}>
                                        <td>{patient ? patient.patient_name : 'Unknown'}</td>
                                        <td>{appointment.appointment_date}</td>
                                        <td>{appointment.appointment_time}</td>
                                        <td>
                                            {appointment.diagnosed ? (
                                                <button
                                                    className="DocDiagnosis-action-button"
                                                    disabled
                                                >
                                                    Diagnosed
                                                </button>
                                            ) : (
                                                <button
                                                    className="DocDiagnosis-action-button"
                                                    onClick={() => {
                                                        navigate(
                                                            `/diagnosispage/${appointment.patient_id}/${doctorId}/${appointment.appointment_id}/${userId}`
                                                        );
                                                    }}
                                                >
                                                    Diagnose
                                                </button>
                                            )}
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

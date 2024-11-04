import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams for accessing route parameters
import { supabase } from '../supabaseClient'; // Make sure you import your Supabase client
import './DocViewAppointments.css';

const DocViewAppointments = () => {
  const { userId, doctorId } = useParams(); // Get userId and doctorId from the URL parameters
  const [appointments, setAppointments] = useState([]); // State to hold appointment data
  const [error, setError] = useState(''); // State to hold any error messages

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch appointments from Supabase using doctorId
        const { data, error: fetchError } = await supabase
          .from('appointments')
          .select('*, patient(patient_name)') // Correctly use 'patient' to fetch patient names
          .eq('doctor_id', doctorId)
          .in('status', ['Pending', 'Scheduled']);  

        if (fetchError) {
          throw fetchError; // Throw an error if fetching fails
        }

        setAppointments(data); // Set appointments state with the fetched data
      } catch (fetchError) {
        console.error('Error fetching appointments:', fetchError);
        setError('Failed to fetch appointments.'); // Set error message if an error occurs
      }
    };

    fetchAppointments(); // Call the function to fetch appointments
  }, [userId, doctorId]); // Depend on userId and doctorId

  // Function to accept an appointment
  const acceptAppointment = async (appointmentId) => {
    try {
      // Update the appointment status in Supabase
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Scheduled' }) // Change status to "Scheduled"
        .eq('appointment_id', appointmentId); // Find the specific appointment by ID

      if (error) {
        throw error; // Throw an error if the update fails
      }

      // Update the local state to reflect the new status
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointment_id === appointmentId
            ? { ...appointment, status: 'Scheduled', accepted: true } // Update status and mark as accepted
            : appointment
        )
      );
    } catch (error) {
      console.error('Error accepting appointment:', error);
      setError('Failed to accept the appointment.'); // Set error message if an error occurs
    }
  };

  // Function to reject an appointment
  const rejectAppointment = async (appointmentId) => {
    try {
      // Update the appointment status in Supabase
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Rejected' }) // Change status to "Rejected"
        .eq('appointment_id', appointmentId); // Find the specific appointment by ID

      if (error) {
        throw error; // Throw an error if the update fails
      }

      // Update the local state to reflect the new status
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointment_id === appointmentId
            ? { ...appointment, status: 'Rejected', rejected: true } // Update status and mark as rejected
            : appointment
        )
      );
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      setError('Failed to reject the appointment.'); // Set error message if an error occurs
    }
  };

  return (
    <div className="docviewappointment-container">
      <div className="docviewappointment-panel">
        {error && <p className="docviewappointment-error-message">{error}</p>} {/* Display error message if exists */}
        <table className="docviewappointment-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="appointment-list">
            {appointments.map((appointment) => (
              <tr key={appointment.appointment_id}>
                <td>{appointment.patient?.patient_name || 'N/A'}</td> {/* Fetching patient name from related table */}
                <td>{appointment.appointment_date}</td>
                <td>{appointment.appointment_time}</td>
                <td>{appointment.status}</td>
                <td>
                  {appointment.status === 'Scheduled' ? (
                    <button className="docviewappointment-button accepted" disabled>
                      Accepted
                    </button>
                  ) : appointment.status === 'Rejected' ? (
                    <button className="docviewappointment-button rejected" disabled>
                      Rejected
                    </button>
                  ) : (
                    <>
                      <button
                        className="docviewappointment-button accept"
                        onClick={() => acceptAppointment(appointment.appointment_id)}
                      >
                        Accept
                      </button>
                      <button
                        className="docviewappointment-button reject"
                        onClick={() => rejectAppointment(appointment.appointment_id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocViewAppointments;

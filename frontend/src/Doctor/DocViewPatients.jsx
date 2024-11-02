import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Make sure to import your Supabase client
import './DocViewPatients.css';

const DocViewPatients = () => {
    const { doctorId } = useParams(); // Get doctorId from URL parameters
    const [patients, setPatients] = useState([]); // State to store patients
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [loading, setLoading] = useState(true); // State for loading
    const [errorMessage, setErrorMessage] = useState(''); // State for error handling

    // Fetch patients when the component mounts
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // Fetch appointments for the specified doctor
                const { data: appointments, error: appointmentsError } = await supabase
                    .from('appointments')
                    .select('patient_id')
                    .eq('doctor_id', doctorId)
                    .eq('status', 'Scheduled');

                if (appointmentsError) throw appointmentsError;

                // If no appointments, return early
                if (!appointments.length) {
                    setPatients([]);
                    setLoading(false);
                    return;
                }

                // Extract unique patient IDs from appointments
                const patientIds = appointments.map(appointment => appointment.patient_id);

                // Fetch patient details based on patient IDs
                const { data: patientsData, error: patientsError } = await supabase
                    .from('patient')
                    .select('*')
                    .in('patient_id', patientIds);

                if (patientsError) throw patientsError;

                setPatients(patientsData); // Set the fetched patient data
            } catch (error) {
                setErrorMessage(`Error fetching patients: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [doctorId]); // Fetch data when doctorId changes

    // Handle input change and update searchTerm state
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter patients based on searchTerm
    const filteredPatients = patients.filter(patient =>
        patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading...</p>; // Show loading state

    return (
        <div className="DocViewPatients-wrapper">
            <div className="DocViewPatients-container">
                <div className="DocViewPatients-search-bar">
                    <form style={{ display: 'flex', alignItems: 'center', marginTop: 20 }} onSubmit={e => e.preventDefault()}>
                        <input
                            type="text"
                            placeholder="Enter patient name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </form>
                </div>

                <div className="DocViewPatients-panel DocViewPatients-panel-default p50 uth-panel">
                    <table className="DocViewPatients-table DocViewPatients-table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: '50%' }}>Name</th>
                                <th style={{ width: '50%' }}>Profile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.patient_id} style={{ textAlign: 'center' }}>
                                        <td>{patient.patient_name}</td>
                                        <td>
                                            <button onClick={() => location.href = `/ViewOneHistory/${patient.patient_id}`}>Medical Profile</button>
                                        </td>
                                    </tr>
                                ))
                            ) : searchTerm ? ( // Check if searchTerm is not empty
                                <tr>
                                    <td colSpan="2" style={{ textAlign: 'center' }}>No matching results found.</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: 'center' }}>No patients found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DocViewPatients;

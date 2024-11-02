import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MedHistory = () => {
    const { patientId, doctorId } = useParams();
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [patientDetails, setPatientDetails] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!patientId) {
            console.error("patientId is undefined. Check the route parameters.");
            setError("Patient ID is missing.");
            return;
        }

        const fetchMedicalHistory = async () => {
            try {
                // Fetch patient details
                const { data: patientData, error: patientError } = await supabase
                    .from('patient')
                    .select('*') // Fetch all details
                    .eq('patient_id', patientId)
                    .single(); // Use .single() since we're expecting a single record

                if (patientError) {
                    console.error("Error fetching patient details:", patientError);
                    setError("Failed to fetch patient details.");
                    return;
                }

                setPatientDetails(patientData);

                // Fetch medical history for the specific doctor
                const { data, error } = await supabase
                    .from('medical_history')
                    .select(`
                        history_id,
                        visit_date,
                        diagnosis,
                        treatment,
                        medications,
                        notes
                    `)
                    .eq('patient_id', patientId)
                    .eq('doctor_id', doctorId); // Filter by doctorId

                if (error) {
                    console.error("Error fetching medical history:", error);
                    setError("Failed to fetch medical history.");
                } else {
                    setMedicalHistory(data);
                }
            } catch (fetchError) {
                console.error("Unexpected error fetching medical history:", fetchError);
                setError("Unexpected error fetching medical history.");
            }
        };

        fetchMedicalHistory();
    }, [patientId, doctorId]); // Include doctorId in dependency array

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (medicalHistory.length === 0) {
        return <div>No medical history found for this patient with the specified doctor.</div>;
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            minWidth: '100vw',
            backgroundColor: '#f5f5f5',
            fontFamily: 'Arial, sans-serif',
            color: 'black',
            padding: '20px'
        }}>
            <div style={{
                marginTop: '5px',
                width: '100%',
                maxWidth: '800px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '24px' }}>Medical History for {patientDetails.patient_name}</h1>
                </div>

                <h2 style={{ fontSize: '20px' }}>Patient Details</h2>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '20px'
                }}>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Name</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patientDetails.patient_name}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Date of Birth</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(patientDetails.dob).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Gender</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patientDetails.gender}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Address</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patientDetails.address}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Phone Number</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patientDetails.phone_number}</td>
                        </tr>
                    </tbody>
                </table>

                {medicalHistory.map((record, index) => (
                    <div key={index} style={{
                        marginBottom: '30px',
                        backgroundColor: '#f9f9f9',
                        padding: '15px',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '10px'
                        }}>
                            <thead>
                                <tr>
                                    <th style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        backgroundColor: '#f2f2f2',
                                        fontWeight: 'bold',
                                        textAlign: 'left'
                                    }}>Category</th>
                                    <th style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        backgroundColor: '#f2f2f2',
                                        fontWeight: 'bold',
                                        textAlign: 'left'
                                    }}>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ backgroundColor: '#f9f9f9' }}>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>Visit Date</td>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>{new Date(record.visit_date).toLocaleDateString()}</td>
                                </tr>
                                <tr style={{ backgroundColor: '#f9f9f9' }}>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>Diagnosis</td>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>{record.diagnosis}</td>
                                </tr>
                                <tr>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>Treatment</td>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>{record.treatment}</td>
                                </tr>
                                <tr style={{ backgroundColor: '#f9f9f9' }}>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>Medications</td>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>{record.medications}</td>
                                </tr>
                                <tr>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>Notes</td>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>{record.notes}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedHistory;

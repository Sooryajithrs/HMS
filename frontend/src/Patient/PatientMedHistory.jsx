import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PatientMedHistory = () => {
    const { patientId } = useParams(); // Make sure this matches your route param exactly
    const [medicalHistory, setMedicalHistory] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if patientId is correctly retrieved
        if (!patientId) {
            console.error("patientId is undefined. Check the route parameters.");
            setError("Patient ID is missing.");
            return;
        }

        const fetchMedicalHistory = async () => {
            try {
                const { data, error } = await supabase
                    .from('medical_history')
                    .select(`
                        history_id,
                        visit_date,
                        diagnosis,
                        treatment,
                        medications,
                        notes,
                        doctors (
                            doctor_name,
                            specialization
                        )
                    `)
                    .eq('patient_id', patientId);

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
    }, [patientId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!medicalHistory) {
        return <div>Loading medical history...</div>;
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
                    <h1 style={{ fontSize: '24px' }}>Medical History</h1>
                </div>

                {medicalHistory.map((record, index) => (
                    <div key={index} style={{
                        marginBottom: '30px',
                        backgroundColor: '#f9f9f9',
                        padding: '15px',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                    }}>
                        <div style={{
                            backgroundColor: '#eee',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            marginBottom: '10px'
                        }}>
                            <h3 style={{ margin: 0 }}>Doctor: {record.doctors.doctor_name}</h3>
                            <p>Specialization: {record.doctors.specialization}</p>
                        </div>

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

export default PatientMedHistory;

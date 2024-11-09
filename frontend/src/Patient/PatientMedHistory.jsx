import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PatientMedHistory = () => {
    const { patientId } = useParams();
    const [medicalHistory, setMedicalHistory] = useState(null);
    const [patientInfo, setPatientInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!patientId) {
            console.error("patientId is undefined. Check the route parameters.");
            setError("Patient ID is missing.");
            return;
        }

        const fetchPatientInfo = async () => {
            try {
                const { data, error } = await supabase
                    .from('patient')
                    .select('patient_name, dob, gender, address, phone_number')
                    .eq('patient_id', patientId)
                    .single();

                if (error) {
                    console.error("Error fetching patient information:", error);
                    setError("Failed to fetch patient information.");
                } else {
                    setPatientInfo(data);
                }
            } catch (fetchError) {
                console.error("Unexpected error fetching patient information:", fetchError);
                setError("Unexpected error fetching patient information.");
            }
        };

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

        fetchPatientInfo();
        fetchMedicalHistory();
    }, [patientId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!medicalHistory || !patientInfo) {
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

                {/* Patient Information Table */}
                <div style={{
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                }}>
                    <h2 style={{
                        marginBottom: '10px',
                        fontSize: '20px',
                        textAlign: 'left'
                    }}>Patient Information</h2>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <tbody>
                            <tr>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    backgroundColor: '#f2f2f2',
                                    width: '40%'
                                }}>Name</td>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'left'
                                }}>{patientInfo.patient_name}</td>
                            </tr>
                            <tr>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    backgroundColor: '#f2f2f2'
                                }}>Date of Birth</td>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'left'
                                }}>{new Date(patientInfo.dob).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    backgroundColor: '#f2f2f2'
                                }}>Gender</td>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'left'
                                }}>{patientInfo.gender}</td>
                            </tr>
                            <tr>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    backgroundColor: '#f2f2f2'
                                }}>Address</td>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'left'
                                }}>{patientInfo.address}</td>
                            </tr>
                            <tr>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    backgroundColor: '#f2f2f2'
                                }}>Phone Number</td>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'left'
                                }}>{patientInfo.phone_number}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Medical History Records */}
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
                            <tbody>
                                <tr>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        fontWeight: 'bold',
                                        textAlign: 'left'
                                    }}>Visit Date</td>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>{new Date(record.visit_date).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        fontWeight: 'bold',
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
                                        fontWeight: 'bold',
                                        textAlign: 'left'
                                    }}>Treatment</td>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        textAlign: 'left'
                                    }}>{record.treatment}</td>
                                </tr>
                                <tr>
                                    <td style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        fontWeight: 'bold',
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
                                        fontWeight: 'bold',
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

import React, { useState, useEffect } from 'react'; // Import useEffect
import { useParams,useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const styles = {
    body: {
        fontFamily: 'Lato, sans-serif',
        backgroundColor: '#f4f4f4',
        margin: 0,
        padding: 0,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'none',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '20px',
        flexGrow: 1,
        overflowY: 'auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    inputContainer: {
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    textarea: {
        width: '100%',
        height: '8vh',
        padding: '10px',
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        resize: 'none',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        outline: 'none',
        color: '#000000',
        cursor: 'text',
    },
    button: {
        backgroundColor: '#000000',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    heading: {
        color: '#000000',
        margin: '2 0 5px 0',
        alignSelf: 'flex-start',
    },
};

const DiagnosisPage = () => {
    const { patientId, doctorId, appointmentId,userId } = useParams();
    const navigate = useNavigate();

    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [medications, setMedications] = useState('');
    const [notes, setNotes] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(null); 

    console.log("Patient ID:", patientId);
    console.log("Doctor User ID:", userId);
    console.log("Doctor ID:", doctorId);
    console.log("Appointment ID:", appointmentId); 

    useEffect(() => {
        const fetchAppointmentDate = async () => {
            const { data, error } = await supabase
                .from('appointments')
                .select('appointment_date')
                .eq('appointment_id', appointmentId)
                .single(); // Fetch a single appointment

            if (error) {
                console.error("Error fetching appointment date:", error);
            } else {
                setAppointmentDate(data.appointment_date); // Set the appointment date
            }
        };

        fetchAppointmentDate(); // Call the function on component mount
    }, [appointmentId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Prepare data to insert
        const data = {
            patient_id: patientId,
            doctor_id: doctorId,
            visit_date: appointmentDate,
            diagnosis,
            treatment,
            medications,
            notes,
        };

        // Insert data into the medical_history table
        const { error:insertError } = await supabase
            .from('medical_history')
            .insert([data]);

        if (insertError) {
            console.error("Error inserting data:", insertError);
        } else {
            const { error: updateError } = await supabase
                .from('appointments')
                .update({ diagnosed: true })
                .eq('appointment_id', appointmentId);
            if(updateError){
                console.error("Error updating appointment status:", updateError);
            }
            else{
                alert("Data inserted successfully");
                console.log("Data inserted successfully:", data);
            }
            
        }
    };

    return (
        <div style={styles.body}>
            <main style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={styles.container}>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <div style={styles.inputContainer}>
                            <h4 style={styles.heading}>Diagnosis</h4>
                            <textarea 
                                id="diagnosis"
                                style={styles.textarea}
                                placeholder="Enter Diagnosis" 
                                aria-label="Enter Diagnosis" 
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)} // Update state on change
                                required 
                            />
                        </div>

                        <div style={styles.inputContainer}>
                            <h4 style={styles.heading}>Treatment</h4>
                            <textarea 
                                id="treatment"
                                style={styles.textarea}
                                placeholder="Enter Treatment" 
                                aria-label="Enter Treatment" 
                                value={treatment}
                                onChange={(e) => setTreatment(e.target.value)}
                                required 
                            />
                        </div>

                        <div style={styles.inputContainer}>
                            <h4 style={styles.heading}>Medications</h4>
                            <textarea 
                                id="medications"
                                style={styles.textarea}
                                placeholder="Enter Medications" 
                                aria-label="Enter Medications" 
                                value={medications}
                                onChange={(e) => setMedications(e.target.value)}
                                required 
                            />
                        </div>

                        <div style={styles.inputContainer}>
                            <h4 style={styles.heading}>Notes</h4>
                            <textarea 
                                id="notes"
                                style={styles.textarea}
                                placeholder="Enter Notes" 
                                aria-label="Enter Notes" 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                required 
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <button type="submit" style={styles.button}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default DiagnosisPage;

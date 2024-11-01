import React from 'react';

// Styling using a CSS-in-JS approach
const styles = {
    body: {
        fontFamily: 'Lato, sans-serif',
        backgroundColor: '#f4f4f4', // Light background color
        margin: 0,
        padding: 0,
        height: '100vh', // Full height of the viewport
        width: '100vw', // Full width of the viewport
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
        overflowY: 'auto', // Allow scrolling if content overflows
        backgroundColor: '#fff', // White background for the container
        borderRadius: '8px', // Rounded corners for the container
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    },
    inputContainer: {
        width: '90%', // Full width for input container
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Align items to the start
    },
    textarea: {
        width: '100%', // Full width for textareas with some padding
        height: '8vh', // Reduced height for textareas
        padding: '10px',
        backgroundColor: '#ffffff', // White background for the textareas
        border: '1px solid #ccc',
        borderRadius: '4px',
        resize: 'none', // Prevent resizing
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow
        outline: 'none', // Remove default outline
        color: '#000000', // Set text color to black for visibility
        cursor: 'text', // Set cursor to text
    },
    textareaFocused: {
        borderColor: '#000000', // Change border color on focus
    },
    button: {
        backgroundColor: '#000000', // Button background
        color: 'white', // Button text color
        padding: '10px 20px', // Padding for button
        border: 'none', // Remove border
        borderRadius: '4px', // Rounded corners for button
        cursor: 'pointer', // Pointer cursor on hover
        transition: 'background-color 0.3s', // Transition effect
    },
    heading: {
        color: '#000000', // Black color for headings
        margin: '0 0 5px 0', // Remove top margin, reduce bottom margin
        alignSelf: 'flex-start', // Align heading to the left
    },
    label: {
        marginBottom: '2px', // Reduced margin for label to space it nicely above the textarea
        alignSelf: 'flex-start', // Align label to the left
    },
};

const DiagnosisPage = () => {
    return (
        <div style={styles.body}>
            <main style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={styles.container}>
                    <div style={styles.inputContainer}>
                        <h4 style={styles.heading}>Diagnosis</h4>
                        <label htmlFor="diagnosis" style={styles.label}>Diagnosis:</label>
                        <textarea 
                            id="diagnosis"
                            style={styles.textarea}
                            placeholder="Enter Diagnosis" 
                            aria-label="Enter Diagnosis" 
                            required 
                        />
                    </div>

                    <div style={styles.inputContainer}>
                        <h4 style={styles.heading}>Treatment</h4>
                        <label htmlFor="treatment" style={styles.label}>Treatment:</label>
                        <textarea 
                            id="treatment"
                            style={styles.textarea}
                            placeholder="Enter Treatment" 
                            aria-label="Enter Treatment" 
                            required 
                        />
                    </div>

                    <div style={styles.inputContainer}>
                        <h4 style={styles.heading}>Medications</h4>
                        <label htmlFor="medications" style={styles.label}>Medications:</label>
                        <textarea 
                            id="medications"
                            style={styles.textarea}
                            placeholder="Enter Medications" 
                            aria-label="Enter Medications" 
                            required 
                        />
                    </div>

                    <div style={styles.inputContainer}>
                        <h4 style={styles.heading}>Notes</h4>
                        <label htmlFor="notes" style={styles.label}>Notes:</label>
                        <textarea 
                            id="notes"
                            style={styles.textarea}
                            placeholder="Enter Notes" 
                            aria-label="Enter Notes" 
                            required 
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <button type="submit" style={styles.button}>
                            Submit
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DiagnosisPage;

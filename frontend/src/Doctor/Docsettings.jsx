import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import bcrypt from 'bcryptjs';
import { supabase } from '../supabaseClient';

const DocSettings = () => {
    const { userId } = useParams(); // Get userId from URL parameters
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            // Fetch the password hash from the users table using userId
            const { data: userData, error: fetchError } = await supabase
                .from('users')
                .select('password_hash')
                .eq('user_id', userId) // Use userId to find the user
                .single();

            if (fetchError || !userData) {
                setError("User not found.");
                return;
            }

            // Compare the old password with the stored password hash
            const isPasswordMatch = await bcrypt.compare(oldPassword, userData.password_hash);
            if (!isPasswordMatch) {
                alert("Old Password is incorrect.");
                return;
            }

            // Hash the new password and update the database
            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            const { error: updateError } = await supabase
                .from('users')
                .update({ password_hash: newPasswordHash })
                .eq('user_id', userId); // Use userId to update the user

            if (updateError) throw updateError;

            alert("Password Reset Successful");
            setOldPassword(''); // Clear the old password input
            setNewPassword(''); // Clear the new password input
        } catch (error) {
            console.error("Error resetting password:", error);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <style>
                {`
                    .doc-settings-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: flex-start;
                        width: 100%;
                        min-height: 100vh;
                        padding-top: 20px;
                    }

                    .doc-settings-title {
                        margin-top: 60px;
                        font-size: 24px;
                        font-weight: bold;
                        font-family: 'Times New Roman', Times, serif;
                        text-align: center;
                    }

                    .doc-settings-form {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        background-color: white;
                        max-width: 400px;
                        padding: 50px;
                        border: 2px solid black; 
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }

                    .label-old-password,
                    .label-new-password {
                        font-family: 'Times New Roman', Times, serif;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }

                    .input-old-password,
                    .input-new-password {
                        width: 100%;
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 15px;
                    }

                    .submit-button {
                        font-family: 'Times New Roman', Times, serif;
                        width: 100%;
                        padding: 10px;
                        background-color: #0A5F70;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-left: 10px;
                    }

                    .error-message {
                        font-family: 'Times New Roman', Times, serif;
                        color: red;
                        font-weight: bold;
                        text-align: center;
                        margin-top: 10px;
                    }
                `}
            </style>

            <div className="doc-settings-container">
                <h3 className='doc-settings-title'>Change Password</h3>
                {error && <div className="error-message">{error}</div>} {/* Display error message if exists */}
                <form id="password-change-form" className="doc-settings-form" onSubmit={handleSubmit}>
                    <label className="label-old-password">Old Password</label>
                    <input
                        type="password"
                        className="input-old-password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />

                    <br />

                    <label className="label-new-password">New Password</label>
                    <input
                        type="password"
                        className="input-new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <br />

                    <button type="submit" className="submit-button">Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default DocSettings;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import bcrypt from 'bcryptjs';
import { supabase } from '../supabaseClient';
import '../Doctor/Docsettings.css'; // Import the CSS file

const AdminSettings = () => {
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
            <div className="admin-settings-container">
                <h3 className='admin-settings-title'>Change Password</h3>
                {error && <div className="admin-settings-error-message">{error}</div>} {/* Display error message if exists */}
                <form id="password-change-form" className="admin-settings-form" onSubmit={handleSubmit}>
                    <label className="admin-settings-label-old-password">Old Password</label>
                    <input
                        type="password"
                        className="admin-settings-input-old-password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />

                    <br />

                    <label className="admin-settings-label-new-password">New Password</label>
                    <input
                        type="password"
                        className="admin-settings-input-new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <br />

                    <button type="submit" className="admin-settings-submit-button">Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
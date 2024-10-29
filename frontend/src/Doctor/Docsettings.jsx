import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { supabase } from '../supabaseClient';
import './Docsettings.css'; 

const DocSettings = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            // Get the user session to obtain the email
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;
            console.log('Session:', session); // Debugging output
            if (!session) {
                setError("User session not found.");
                return;
            }

            const Email = session.user.email;
            // Fetch the password hash from the users table using the email
            const { data: userData, error: fetchError } = await supabase
                .from('users')
                .select('password_hash')
                .eq('email', Email)
                .single();

            if (fetchError) throw fetchError;

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
                .eq('email', Email);

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

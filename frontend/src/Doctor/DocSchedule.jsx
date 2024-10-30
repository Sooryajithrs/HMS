import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DocSchedule = () => {
    const { userId, doctorId } = useParams(); // Extracting userId and doctorId from URL
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [breakStartTime, setBreakStartTime] = useState(''); // New state for break start time
    const [breakEndTime, setBreakEndTime] = useState(''); // New state for break end time
    const [schedule, setSchedule] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingScheduleId, setEditingScheduleId] = useState(null);

    // Fetch current schedules from Supabase
    useEffect(() => {
        const fetchSchedules = async () => {
            const { data, error } = await supabase
                .from('schedule')
                .select('*')
                .eq('doctor_id', doctorId);

            if (error) {
                console.error('Error fetching schedules:', error);
            } else {
                setSchedule(data);
            }
        };

        fetchSchedules();
    }, [doctorId]);

    const handleAddSchedule = async (e) => {
        e.preventDefault();
        if (!dayOfWeek || !startTime || !endTime || !breakStartTime || !breakEndTime) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        const newSchedule = {
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime,
            break_start_time: breakStartTime,
            break_end_time: breakEndTime,
            doctor_id: doctorId,
        };

        try {
            if (editingScheduleId) {
                // Update existing schedule
                const { error } = await supabase
                    .from('schedule')
                    .update(newSchedule)
                    .eq('schedule_id', editingScheduleId);

                if (error) {
                    console.error('Error updating schedule:', error);
                    setErrorMessage('Failed to update schedule. Please check your inputs.');
                    return;
                }

                // Update the local state
                setSchedule((prevSchedule) =>
                    prevSchedule.map((entry) =>
                        entry.schedule_id === editingScheduleId ? { ...entry, ...newSchedule } : entry
                    )
                );
            } else {
                // Check if the new schedule overlaps with existing schedules
                const overlappingSchedule = schedule.find(entry => 
                    entry.day_of_week === dayOfWeek &&
                    (
                        (startTime < entry.end_time && endTime > entry.start_time) || // Time overlap
                        (breakStartTime < entry.break_end_time && breakEndTime > entry.break_start_time) // Break overlap
                    )
                );

                if (overlappingSchedule) {
                    setErrorMessage('Please update the existing schedule');
                    return; // Prevent adding a schedule if it overlaps
                }

                // Insert new schedule into Supabase
                const { data, error } = await supabase.from('schedule').insert([newSchedule]).single();

                if (error) {
                    console.error('Error adding schedule:', error);
                    setErrorMessage('Failed to add schedule. Please check your inputs.');
                    return;
                }

                // If successful, update the schedule state to include the new schedule
                setSchedule([...schedule, { ...newSchedule, schedule_id: data.schedule_id }]);
            }

            // Reset form fields
            setDayOfWeek('');
            setStartTime('');
            setEndTime('');
            setBreakStartTime('');
            setBreakEndTime('');
            setEditingScheduleId(null);
            setErrorMessage('');
        } catch (err) {
            console.error('Unexpected error occurred:', err);
        }
    };

    const handleEditSchedule = (entry) => {
        // Set fields with the selected schedule data
        setDayOfWeek(entry.day_of_week);
        setStartTime(entry.start_time);
        setEndTime(entry.end_time);
        setBreakStartTime(entry.break_start_time);
        setBreakEndTime(entry.break_end_time);
        setEditingScheduleId(entry.schedule_id);
    };

    return (
        <div className="doctor-schedule-container">
            <style jsx="true">{`
                .doctor-schedule-container {
                    max-width: 500px;
                    margin: 40px auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                }

                h2, h3 {
                    text-align: center;
                    color: #333;
                }

                #scheduleList {
                    list-style: none;
                    padding: 0;
                    margin: 20px 0;
                    max-height: 200px;
                    overflow-y: auto;
                }

                #scheduleList li {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px;
                    margin-bottom: 10px;
                    background-color: #e0f7fa;
                    border-radius: 5px;
                    font-size: 16px;
                }

                #scheduleList li button {
                    padding: 5px 10px;
                    border: none;
                    border-radius: 5px;
                    background-color: #00796b;
                    color: #fff;
                    cursor: pointer;
                    font-size: 14px;
                }

                #scheduleList li button:hover {
                    background-color: #004d40;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                label {
                    display: flex;
                    flex-direction: column;
                    font-weight: bold;
                    color: #555;
                }

                select,
                input[type="time"] {
                    padding: 8px;
                    font-size: 14px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    width: 100%;
                    box-sizing: border-box;
                }

                button[type="submit"] {
                    padding: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    border: none;
                    border-radius: 5px;
                    background-color: #2196f3;
                    color: #fff;
                    cursor: pointer;
                    margin-top: 10px;
                }

                button[type="submit"]:hover {
                    background-color: #0b7dda;
                }

                .back-button {
                    display: block;
                    padding: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                    border: none;
                    border-radius: 5px;
                    background-color: #9e9e9e;
                    color: #fff;
                    cursor: pointer;
                    text-decoration: none;
                    margin-top: 10px;
                }

                .back-button:hover {
                    background-color: #757575;
                }

                #errorMessage {
                    color: red;
                    font-size: 14px;
                    text-align: center;
                }
            `}</style>

            <h2>Manage Schedule</h2>
            <ul id="scheduleList">
                {schedule.map((entry) => (
                    <li key={entry.schedule_id}>
                        {entry.day_of_week}: {entry.start_time} - {entry.end_time} (Break: {entry.break_start_time} - {entry.break_end_time})
                        <button onClick={() => handleEditSchedule(entry)}>Edit</button>
                    </li>
                ))}
            </ul>

            <h3>{editingScheduleId ? 'Edit Schedule' : 'Add New Schedule'}</h3>
            <form id="scheduleForm" onSubmit={handleAddSchedule}>
                <label>
                    Day of Week:
                    <select
                        id="dayOfWeek"
                        name="dayOfWeek"
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(e.target.value)}
                        required
                    >
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </label>
                <label>
                    Start Time:
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </label>
                <label>
                    End Time:
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Break Start Time:
                    <input
                        type="time"
                        id="breakStartTime"
                        name="breakStartTime"
                        value={breakStartTime}
                        onChange={(e) => setBreakStartTime(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Break End Time:
                    <input
                        type="time"
                        id="breakEndTime"
                        name="breakEndTime"
                        value={breakEndTime}
                        onChange={(e) => setBreakEndTime(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">{editingScheduleId ? 'Update Schedule' : 'Add Schedule'}</button>
                {errorMessage && <div id="errorMessage">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default DocSchedule;

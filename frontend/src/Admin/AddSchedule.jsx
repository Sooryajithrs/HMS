// src/AddSchedule.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AddSchedule.css';

const AddSchedule = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [breakStartTime, setBreakStartTime] = useState('');
  const [breakEndTime, setBreakEndTime] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  // Fetch doctors from the database
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('doctor_id, doctor_name');

      if (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors.');
      } else {
        setDoctors(data);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find the doctor_id based on the selected doctorName
    const doctor = doctors.find(doc => doc.doctor_name === doctorName);
    if (!doctor) {
      setError('Doctor not found');
      return;
    }

    const { doctor_id } = doctor;

    // Check if a schedule already exists for the selected doctor and day
    const { data: existingSchedules, error: fetchError } = await supabase
      .from('schedule')
      .select('*')
      .eq('doctor_id', doctor_id)
      .eq('day_of_week', dayOfWeek);

    if (fetchError) {
      console.error('Error checking existing schedule:', fetchError);
      setError('Failed to check existing schedule.');
      return;
    }

    // Check if any schedules were returned
    if (existingSchedules.length > 0) {
      // If a schedule exists, update it; otherwise, insert a new schedule
      const existingSchedule = existingSchedules[0]; // Update the first one found
      const { error: updateError } = await supabase
        .from('schedule')
        .update({
          start_time: startTime,
          end_time: endTime,
          break_start_time: breakStartTime,
          break_end_time: breakEndTime,
        })
        .eq('schedule_id', existingSchedule.schedule_id); // Make sure to use the correct ID field

      if (updateError) {
        console.error('Error updating schedule:', updateError);
        setError(updateError.message);
        return;
      }
      alert('Schedule updated successfully!');
    } else {
      const { error: insertError } = await supabase
        .from('schedule')
        .insert([{
          doctor_id,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          break_start_time: breakStartTime,
          break_end_time: breakEndTime,
        }]);

      if (insertError) {
        console.error('Error inserting schedule:', insertError);
        setError(insertError.message);
        return;
      }
      alert('Schedule added successfully!');
    }
  };

  return (
    <div className="addschedule-container">
      <h1 className="addschedule-title">Add Schedule</h1>
      {error && <p className="addschedule-error-message">{error}</p>}
      <form className="addschedule-form" onSubmit={handleSubmit}>
        <div className="addschedule-input-group">
          <label className="addschedule-label" htmlFor="doctorName">Doctor Name:</label>
          <select
            className="addschedule-input"
            id="doctorName"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.doctor_id} value={doctor.doctor_name}>{doctor.doctor_name}</option>
            ))}
          </select>
        </div>

        <div className="addschedule-input-group">
          <label className="addschedule-label" htmlFor="dayOfWeek">Day of the Week:</label>
          <select
            className="addschedule-input"
            id="dayOfWeek"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            required
          >
            <option value="">Select a day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        <div className="addschedule-input-group">
          <label className="addschedule-label" htmlFor="startTime">Start Time:</label>
          <input
            className="addschedule-input"
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="addschedule-input-group">
          <label className="addschedule-label" htmlFor="endTime">End Time:</label>
          <input
            className="addschedule-input"
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="addschedule-input-group">
          <label className="addschedule-label" htmlFor="breakStartTime">Break Start:</label>
          <input
            className="addschedule-input"
            type="time"
            id="breakStartTime"
            value={breakStartTime}
            onChange={(e) => setBreakStartTime(e.target.value)}
          />
        </div>

        <div className="addschedule-input-group">
          <label className="addschedule-label" htmlFor="breakEndTime">Break End:</label>
          <input
            className="addschedule-input"
            type="time"
            id="breakEndTime"
            value={breakEndTime}
            onChange={(e) => setBreakEndTime(e.target.value)}
          />
        </div>

        <button className="addschedule-submit-button" type="submit">Add Schedule</button>
      </form>
    </div>
  );
};

export default AddSchedule;

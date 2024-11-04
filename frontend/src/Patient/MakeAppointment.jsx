import React, { useEffect, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useParams } from "react-router-dom";
import { supabase } from '../supabaseClient';

const styles = {
  container: {
    maxWidth: "500px",
    width: "90%",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "2px solid #555",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    margin: "0 auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#00739D",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  scheduleContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
  scheduleItem: {
    marginBottom: "10px",
  },
};

const MakeAppointment = () => {
  const { userId, patientId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState("");

  useEffect(() => {
    flatpickr("#datetime-picker", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      minDate: "today",
      time_24hr: true,
      onChange: (selectedDates) => {
        setSelectedDateTime(selectedDates[0] ? selectedDates[0].toISOString() : "");
      },
    });

    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("doctor_id, doctor_name")
        .order("doctor_name", { ascending: true });

      if (error) {
        console.error("Error fetching doctors:", error);
      } else {
        setDoctors(data);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (selectedDoctorId) {
        const { data, error } = await supabase
          .from("schedule")
          .select("day_of_week, start_time, end_time, break_start_time, break_end_time")
          .eq("doctor_id", selectedDoctorId);

        if (error) {
          console.error("Error fetching schedule:", error);
        } else {
          setDoctorSchedule(data);
        }
      }
    };

    fetchDoctorSchedule();
  }, [selectedDoctorId]);

  const isTimeAvailable = (dateTime) => {
    const selectedDate = new Date(dateTime);
    const selectedDay = selectedDate.toLocaleString('en-US', { weekday: 'long' });
    const selectedTime = selectedDate.toTimeString().split(' ')[0];

    for (const schedule of doctorSchedule) {
      if (schedule.day_of_week === selectedDay) {
        if (
          selectedTime >= schedule.start_time &&
          selectedTime <= schedule.end_time
        ) {
          if (schedule.break_start_time && schedule.break_end_time) {
            if (
              selectedTime >= schedule.break_start_time &&
              selectedTime <= schedule.break_end_time
            ) {
              return false;
            }
          }
          return true;
        }
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctorId || !selectedDateTime) {
      alert("Please select a doctor and a date & time.");
      return;
    }

    if (!isTimeAvailable(selectedDateTime)) {
      alert("The selected time is not available. Please choose another time.");
      return;
    }

    // Extract the date and time without applying any timezone adjustments
    const selectedDate = new Date(selectedDateTime);
    const appointmentDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    const appointmentTime = selectedDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); // Local time in HH:MM 24-hour format

    // Check if the time slot is already taken
    const { data: existingAppointments, error: checkError } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", selectedDoctorId)
      .eq("appointment_date", appointmentDate)
      .eq("appointment_time", appointmentTime);

    if (checkError) {
      console.error("Error checking existing appointments:", checkError);
      alert("Error checking existing appointments. Please try again.");
      return;
    }

    if (existingAppointments.length > 0) {
      alert("The selected time slot is already taken. Please choose another time.");
      return;
    }

    // Insert new appointment with status set to "Pending"
    const { data, error } = await supabase
      .from("appointments")
      .insert([{
        patient_id: patientId,
        doctor_id: selectedDoctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: "Pending", // Change status to "Pending"
      }]);

    if (error) {
      console.error("Error scheduling appointment:", error);
      alert("Error scheduling appointment. Please try again.");
    } else {
      alert("Appointment scheduled successfully!");
      setSelectedDoctorId("");
      setSelectedDateTime("");
      setDoctorSchedule([]);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Schedule Appointment</h2>

      <form id="appointment-form" onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <select
            id="doctors-dropdown"
            style={styles.input}
            required
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            <option value="" disabled>Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.doctor_id} value={doctor.doctor_id}>
                {doctor.doctor_name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <input type="text" id="datetime-picker" placeholder="Select date & time" required style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <button type="submit" style={styles.button}>Attempt To Schedule</button>
        </div>
      </form>

      {doctorSchedule.length > 0 && (
        <div style={styles.scheduleContainer}>
          <h3>Doctor's Schedule:</h3>
          {doctorSchedule.map((schedule, index) => (
            <div key={index} style={styles.scheduleItem}>
              <strong>{schedule.day_of_week}:</strong> {schedule.start_time} - {schedule.end_time}
              {schedule.break_start_time && (
                <div>Break: {schedule.break_start_time} - {schedule.break_end_time}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MakeAppointment;

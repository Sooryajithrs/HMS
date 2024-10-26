# Hospital Management System - DBMS

Hospital Management System made for a DBMS course project. Hospitals interact with a lot of people daily, and there are various activities involved in day-to-day operations, such as booking appointments, managing doctor schedules, managing patient diagnoses, and managing medical histories. The aim of this project is to demonstrate how data related to these tasks can be managed more efficiently using databases.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Supabase

## Features

### Patient Side Features
1. Separate interface and login for patients.
2. Patients can book appointments.
3. Patients can provide previous medical history.
4. Patients can view/update/cancel already booked appointments if necessary.
5. The system avoids appointment clashes, ensuring each patient gets their slot.
6. Patients can see complete diagnoses, prescriptions, and medical history.
7. Patient medical history is only available to the doctor with whom the appointment is booked to ensure privacy.

### Doctor Side Features
1. Separate interface and login for doctors.
2. The system respects doctor schedules and does not allow appointments when a doctor is busy or has a break.
3. Doctors can access patient history and profiles and add to patient history.
4. Doctors can provide diagnoses and prescriptions.
5. Doctors can modify diagnoses and prescriptions.

## Instructions to Run
1. Run `npm install` in the frontend directory.
2. Run `npm run dev` in the frontend directory.
3. Access `localhost:5173` from your browser.

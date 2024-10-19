import React,{useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Forgotpassword from './components/Forgotpassword';
import { supabase } from './supabaseClient'; 
//import bcrypt from 'bcryptjs';

/*async function migratePasswords() {
  try {
      const { data: users, error: fetchError } = await supabase
          .from('users')
          .select('user_id, password');

      if (fetchError) throw fetchError;

      for (const user of users) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          const { error: updateError } = await supabase
              .from('users')
              .update({ password_hash: hashedPassword })
              .eq('user_id', user.user_id);

          if (updateError) {
              console.error(`Error updating user ${user.id}:`, updateError);
          } 
          else {
              console.log(`User ${user.user_id} password hashed and updated.`);
          }
      }
  } 
  catch (err) {
      console.error('Error during password migration:', err);
  }
}*/


function App() {

  /*useEffect(() => {
    // Run migration on app initialization
    migratePasswords();
  }, []);*/

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<Forgotpassword/>}/>
      </Routes>
    </Router>
  );
}

export default App;

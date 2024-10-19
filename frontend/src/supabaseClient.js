
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hhgmustgzexcfpijimge.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZ211c3RnemV4Y2ZwaWppbWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg2Njk1ODUsImV4cCI6MjA0NDI0NTU4NX0.5ceuzanP53FFx-IyMRWXbiPMXdZhyFegozTBG8XeOXM'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

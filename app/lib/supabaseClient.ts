// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient('https://bjqklcipbvoovkszvira.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcWtsY2lwYnZvb3Zrc3p2aXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTk0MjQsImV4cCI6MjA3MDIzNTQyNH0.WBKQAnUU3YECnbK45LZ9uMo8vJYN8k5QPpjI1vOf7uU');
export { supabase };
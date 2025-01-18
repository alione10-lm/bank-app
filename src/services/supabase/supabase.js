import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ostfqnrvunmmjxicfezh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdGZxbnJ2dW5tbWp4aWNmZXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MDEzODksImV4cCI6MjA1MjI3NzM4OX0.3Robcn4VeY_IsCpLPw3kpNMu0R5RfoiKQOiyBFVvHyw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

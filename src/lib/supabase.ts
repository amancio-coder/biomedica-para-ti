import { createClient } from '@supabase/supabase-js'

// Ignoramos process.env temporalmente para evitar caracteres corruptos
const supabaseUrl = 'https://nhfpsfsqxczdamfvasvu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZnBzZnNxeGN6ZGFtZnZhc3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NTc0MzMsImV4cCI6MjEwNTMzMzQzM30.i8tQ831Z7MReGDhJu_F6t1XvcaOS86-pxmdxwO8sYwY'
export const supabase = createClient(supabaseUrl, supabaseKey)
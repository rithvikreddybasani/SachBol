import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eufdbovkivkzbrbyxfox.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZmRib3ZraXZremJyYnl4Zm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTAzNDgsImV4cCI6MjA2NDI2NjM0OH0.wcDnPnlqasQ7jWLOySKqMkL_92QRykNUoPwr1w8K8VU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'visible-governance'
    },
    fetch: fetch.bind(globalThis)
  }
});

// Create temporary police admin account
export const createPoliceAdmin = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'police.admin@department.gov.in',
    password: 'PoliceAdmin@2024',
    options: {
      data: {
        name: 'Police Department Admin',
        role: 'admin',
        department: 'Police'
      }
    }
  });

  if (error) {
    console.error('Error creating police admin:', error);
    return null;
  }

  return data;
};
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://qydlitafmsldmdsunmxd.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5ZGxpdGFmbXNsZG1kc3VubXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4Njk2NDAsImV4cCI6MjA0MDQ0NTY0MH0.zd-lzcCmOx5cWkLs4cvjKrJpApT1-9SFSu54oN2XJko';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

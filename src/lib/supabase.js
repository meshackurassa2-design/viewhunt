import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cmruitqgakxnbmwqphhv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcnVpdHFnYWt4bmJtd3FwaGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTE5OTgsImV4cCI6MjA4NjA2Nzk5OH0.uZ14rshsaGS8njdj98G6FLVjodoQlKCSpKXR_ZYiHiA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

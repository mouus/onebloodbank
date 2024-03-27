import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kowlotgjzrxxwtidvggh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvd2xvdGdqenJ4eHd0aWR2Z2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA5OTYyOTksImV4cCI6MjAyNjU3MjI5OX0.6aVcoT4OXIiXV09IbvX7E9HU-YH8YlferMUv3lfsa3c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
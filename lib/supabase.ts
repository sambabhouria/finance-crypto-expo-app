// https://supabase.com/docs

// https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
// https://docs.expo.dev/guides/using-supabase/
//https://supabase.com/dashboard/projects

// https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?utm_source=expo&utm_medium=referral&utm_term=expo-react-native
// https://supabase.com/docs/guides/auth/social-login/auth-apple?platform=react-native&utm_source=expo&utm_medium=referral&utm_term=expo-react-native
// https://supabase.com/docs/guides/auth/social-login/auth-google?platform=react-native&utm_source=expo&utm_medium=referral&utm_term=expo-react-native
// SecureStore : import * as SecureStore from 'expo-secure-store';

// https://github.com/ousszizou/user-management-app-yt/blob/main/lib/contexts/auth/authContext.tsx
// https://github.com/ousszizou/user-management-app-yt/tree/main

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

//const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
//const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabaseUrl =
  process.env.EXPO_REACT_NATIVE_SUPABASE_URL ||
  'https://idijtlziprmifipxgfvs.supabase.co'
const supabaseKey =
  process.env.EXPO_REACT_NATIVE_SUPABASE_SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaWp0bHppcHJtaWZpcHhnZnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzNDUzNzMsImV4cCI6MjAzNzkyMTM3M30.w7PizXjLz-PH_DgjEW_rbaDXGJfbBPmY__BVxi6IiHc'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

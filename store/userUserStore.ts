import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session, User } from '@supabase/supabase-js'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  session: Session | null
  setSession: (session: Session | null) => void
  isLoggedIn: boolean
  // isOnboarded: boolean
  setLoggedIn: (isLoggedIn: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoggedIn: false,
      isOnboarded: false,
      setUser: (user: User | null) => set((state) => ({ user })),
      setLoggedIn: (isLoggedIn: boolean) =>
        set((state) => ({ isLoggedIn: isLoggedIn })),
      setSession: (session: Session | null) =>
        set((state) => ({ session: session })),
    }),
    {
      name: 'fintechcrypto-user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

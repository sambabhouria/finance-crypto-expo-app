import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/store/userUserStore'

export default function useSupabaseAuth() {
  const { session, setSession, setUser } = useUserStore()

  async function signUpWithEmail(email: string, password: string) {
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    })
    return {
      error,
      session,
      user,
    }
  }

  async function singnInWithEmail(email: string, password: string) {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return {
      error,
      data,
    }
  }

  // async function signUpWithEmail(email: string, password: string) {
  //   const { error, data } = await supabase.auth.signUp({
  //     email,
  //     password,
  //   })
  //   return {
  //     error,
  //     data,
  //   }
  // }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setSession(null)
      setUser(null)
    }
    return {
      error,
    }
  }

  async function getUserProfile() {
    if (!session?.user) throw new Error('No user on the session')
    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, full_name, avatar_url, website`)
      .eq('id', session?.user?.id)
      .single()

    return {
      error,
      data,
      status,
    }
  }

  // https://supabase.com/docs/reference/javascript/auth-startautorefresh

  async function updateUserProfile(
    userName: string,
    fullName: string,
    avatarUrl: string
  ) {
    if (!session?.user) throw new Error('No user on the session')
    const updates = {
      id: session?.user?.id,
      username: userName,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }
    console.log('🚀 ~ useSupabaseAuth ~ updates:', updates)

    // Upsert data
    const { error } = await supabase.from('profiles').upsert(updates)

    return {
      error,
    }

    // Update data
    // const {
    //   status,
    //   error,
    //   data: user,
    // } = await supabase
    //   .from('profiles')
    //   .update(updates)
    //   .eq('id', session?.user?.id)
    // return {
    //   user,
    //   status,
    //   error,
    // }

    // const { data: user, error } = await supabase.auth.admin.updateUserById(
    //   session?.user?.id,
    //   updates
    // )
    // return {
    //   user,
    //   error,
    // }
  }
  return {
    singnInWithEmail,
    signUpWithEmail,
    signOut,
    getUserProfile,
    updateUserProfile,
  }
}

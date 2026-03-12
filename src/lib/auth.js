import { supabase } from './supabase'

export const mockAuth = {
  async createUserWithEmailAndPassword(email, password, displayName) {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split('@')[0] }
      }
    })
    if (error) throw error
    return { user }
  },

  async signInWithEmailAndPassword(email, password) {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return { user }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async onAuthStateChanged(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null)
    })
    
    // Initial check
    const { data: { session } } = await supabase.auth.getSession()
    callback(session?.user || null)

    return () => subscription.unsubscribe()
  },

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  async canClaimTrial(ip) {
    try {
      const res = await fetch('http://localhost:3001/api/trial/claim-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      })
      const data = await res.json()
      return data.allowed
    } catch (e) {
      console.error('Trial IP check failed:', e)
      return false
    }
  }
}

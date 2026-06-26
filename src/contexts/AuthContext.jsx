'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const supabase = createClient()
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
    return data
  }, [supabase])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user)
          setIsAuthenticated(true)
          await fetchProfile(session.user.id)
        } else {
          setCurrentUser(null)
          setProfile(null)
          setIsAuthenticated(false)
        }
        setLoading(false)
      }
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user)
        setIsAuthenticated(true)
        fetchProfile(session.user.id).then(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [supabase, fetchProfile])

  const signup = async (email, password, passwordConfirm, name) => {
    try {
      if (password !== passwordConfirm) {
        return { success: false, error: 'Passwords do not match.' }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data?.user?.identities?.length === 0) {
        return { success: false, error: 'An account with this email already exists.' }
      }

      try {
        await supabase.from('termsAcceptance').insert({
          userId: data.user.id,
          userAgent: navigator.userAgent,
        })
      } catch (tcError) {
        console.error('Failed to record T&C acceptance:', tcError)
      }

      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message || 'An error occurred during signup.' }
    }
  }

  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Invalid email or password.' }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchProfile(currentUser.id)
    }
  }

  const value = {
    currentUser,
    profile,
    isPremium: profile?.is_premium ?? false,
    isAdmin: profile?.role === 'admin',
    isAuthenticated,
    loading,
    signup,
    login,
    logout,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

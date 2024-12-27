import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

export const useUserStore = create(
  persist(
    (set) => ({
      ...initialState,

      // Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Login action
      login: async (token, user) => {
        set({ 
          token,
          user,
          isAuthenticated: true,
          error: null,
          isLoading: false
        })
      },

      // Logout action
      logout: () => {
        localStorage.removeItem('token')
        set(initialState)
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Update user
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

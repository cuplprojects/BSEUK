import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from "jwt-decode"

const initialState = {
  token: null,
  user: null,
  userId: null,
  userDetails: null,
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
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
            
          localStorage.setItem('userToken', token);
          
          set({ 
            token,
            user,
            userId,
            isAuthenticated: true,
            error: null,
            isLoading: false
          });
        } catch (error) {
          console.error('Token decode error:', error);
          set({ error: 'Invalid token format' });
        }
      },

      // Set user details
      setUserDetails: (details) => set({ userDetails: details }),

      // Logout action
      logout: () => {
        localStorage.removeItem('userToken');
        set(initialState);
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        userId: state.userId,
        userDetails: state.userDetails,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

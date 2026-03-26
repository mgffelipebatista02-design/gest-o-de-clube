import { create } from 'zustand'
import type { User, UserRole, Athlete } from '@/types'
import { mockUsers } from '@/data/mockUsers'
import { mockAthletes } from '@/data/mockAthletes'

interface AuthState {
  user: (User | Athlete) | null
  isAuthenticated: boolean
  login: (email: string, _password: string) => boolean
  loginAsRole: (role: UserRole) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email: string, _password: string) => {
    const allUsers = [...mockUsers, ...mockAthletes]
    const found = allUsers.find((u) => u.email === email)
    if (found) {
      set({ user: found, isAuthenticated: true })
      return true
    }
    return false
  },

  loginAsRole: (role: UserRole) => {
    if (role === 'atleta') {
      set({ user: mockAthletes[0], isAuthenticated: true })
    } else {
      const found = mockUsers.find((u) => u.role === role)
      if (found) set({ user: found, isAuthenticated: true })
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
}))

import { create } from 'zustand'
import type { ClubEvent } from '@/types'
import { mockEvents } from '@/data/mockEvents'

interface CalendarState {
  events: ClubEvent[]
  addEvent: (event: ClubEvent) => void
  updateEvent: (id: string, event: Partial<ClubEvent>) => void
  deleteEvent: (id: string) => void
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: mockEvents,

  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),

  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
}))

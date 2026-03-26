import { create } from 'zustand'
import type { Notification } from '@/types'
import { mockNotifications } from '@/data/mockNotifications'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.lida).length,

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, lida: true } : n
      )
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.lida).length,
      }
    }),

  markAllAsRead: () => {
    const notifications = get().notifications.map((n) => ({ ...n, lida: true }))
    set({ notifications, unreadCount: 0 })
  },
}))

import { Bell, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { ROLE_LABELS } from '@/types'
import { useState } from 'react'
import { NotificationDropdown } from './NotificationDropdown'

interface TopBarProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function TopBar({ title, subtitle, onMenuClick }: TopBarProps) {
  const user = useAuthStore((s) => s.user)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {user && (
          <div className="hidden md:flex items-center gap-2">
            <img
              src={user.foto}
              alt={user.nome}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-right">
              <p className="text-sm font-medium">{user.nome}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

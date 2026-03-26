import { useNotificationStore } from '@/store/notificationStore'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell, Check, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface NotificationDropdownProps {
  onClose: () => void
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const recent = notifications.slice(0, 6)

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-border shadow-lg z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Notificacoes</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary hover:underline"
          >
            Marcar todas como lidas
          </button>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {recent.map((n) => (
          <button
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${
              !n.lida ? 'bg-primary/5' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.lida ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{n.titulo}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.mensagem}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {format(new Date(n.data), "dd/MM 'as' HH:mm", { locale: ptBR })}
                </p>
              </div>
              {n.lida && <Check className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-1" />}
            </div>
          </button>
        ))}

        {recent.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <Bell className="w-8 h-8" />
            <p className="text-sm">Nenhuma notificacao</p>
          </div>
        )}
      </div>
    </div>
  )
}

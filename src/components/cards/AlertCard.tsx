import { AlertTriangle, XCircle, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AlertCardProps {
  type: 'warning' | 'error' | 'info'
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

const ALERT_CONFIG = {
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-800 dark:text-amber-200',
    buttonColor: 'text-amber-700 hover:text-amber-900 dark:text-amber-300',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600',
    textColor: 'text-red-800 dark:text-red-200',
    buttonColor: 'text-red-700 hover:text-red-900 dark:text-red-300',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800 dark:text-blue-200',
    buttonColor: 'text-blue-700 hover:text-blue-900 dark:text-blue-300',
  },
} as const

export function AlertCard({ type, message, action }: AlertCardProps) {
  const config = ALERT_CONFIG[type]
  const Icon = config.icon

  return (
    <Card className={`border ${config.bg} ${config.border} shadow-sm`}>
      <CardContent className="flex items-start gap-3">
        <Icon className={`mt-0.5 size-5 shrink-0 ${config.iconColor}`} />
        <div className="min-w-0 flex-1">
          <p className={`text-sm ${config.textColor}`}>{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-2 text-sm font-medium underline-offset-2 hover:underline ${config.buttonColor}`}
            >
              {action.label}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

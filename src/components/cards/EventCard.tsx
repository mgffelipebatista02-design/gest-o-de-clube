import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { type ClubEvent, EVENT_COLORS, EVENT_LABELS } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface EventCardProps {
  event: ClubEvent
  compact?: boolean
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const color = EVENT_COLORS[event.tipo]
  const label = EVENT_LABELS[event.tipo]
  const startDate = new Date(event.dataInicio)

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="flex">
        <div className="w-1 shrink-0" style={{ backgroundColor: color }} />
        <CardContent className={`flex-1 ${compact ? 'py-2' : ''}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <p className={`font-medium leading-tight ${compact ? 'text-sm' : ''}`}>
                {event.titulo}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  {format(startDate, "dd 'de' MMM", { locale: ptBR })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {format(startDate, 'HH:mm')}
                </span>
                {event.local && !compact && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {event.local}
                  </span>
                )}
              </div>
            </div>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: color }}
            >
              {label}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

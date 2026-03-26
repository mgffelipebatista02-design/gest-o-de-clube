import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react'
import { type ClubEvent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface MatchCardProps {
  event: ClubEvent
}

export function MatchCard({ event }: MatchCardProps) {
  const startDate = new Date(event.dataInicio)

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="flex">
        <div className="w-1 shrink-0 bg-[#C62828]" />
        <div className="flex-1">
          <CardContent className="space-y-3">
            {/* Teams */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold">Clube Pro</p>
              </div>
              <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                VS
              </span>
              <div className="text-left">
                <p className="text-sm font-bold">
                  {event.adversario || 'A definir'}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" />
                {format(startDate, "EEEE, dd 'de' MMM", { locale: ptBR })}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {format(startDate, 'HH:mm')}
              </span>
              {event.local && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" />
                  {event.local}
                </span>
              )}
            </div>

            {/* Competition badge */}
            {event.competicao && (
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  <Trophy className="size-3" />
                  {event.competicao}
                </span>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

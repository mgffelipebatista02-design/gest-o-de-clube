import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Users,
  Trophy,
  Shield,
} from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { useCalendarStore } from '@/store/calendarStore'
import { EVENT_COLORS, EVENT_LABELS } from '@/types'
import type { ConfirmationStatus } from '@/types'
import { mockAthletes } from '@/data/mockAthletes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const CONFIRMATION_LABELS: Record<ConfirmationStatus, string> = {
  confirmado: 'Confirmado',
  'ausencia-justificada': 'Ausencia Justificada',
  'nao-confirmou': 'Nao Confirmou',
}

const CONFIRMATION_STYLES: Record<ConfirmationStatus, string> = {
  confirmado: 'bg-green-100 text-green-800',
  'ausencia-justificada': 'bg-yellow-100 text-yellow-800',
  'nao-confirmou': 'bg-gray-100 text-gray-600',
}

// Mock attendance data for display purposes
function getMockAttendance(eventId: string) {
  const statuses: ConfirmationStatus[] = ['confirmado', 'ausencia-justificada', 'nao-confirmou']
  return mockAthletes.slice(0, 11).map((athlete, index) => ({
    atletaId: athlete.id,
    eventoId: eventId,
    status: statuses[index % 3] as ConfirmationStatus,
    athlete,
  }))
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const events = useCalendarStore((s) => s.events)

  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Evento nao encontrado" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-muted-foreground">O evento solicitado nao foi encontrado.</p>
          <Button variant="outline" onClick={() => navigate('/calendario')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar ao Calendario
          </Button>
        </div>
      </div>
    )
  }

  const attendance = getMockAttendance(event.id)
  const confirmedCount = attendance.filter((a) => a.status === 'confirmado').length
  const startDate = parseISO(event.dataInicio)
  const endDate = parseISO(event.dataFim)

  return (
    <div className="flex flex-col h-full">
      <TopBar title={event.titulo} />

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={() => navigate('/calendario')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>

        {/* Event header */}
        <Card className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-xl font-bold">{event.titulo}</h2>
              <Badge
                className="mt-2"
                style={{
                  backgroundColor: `${EVENT_COLORS[event.tipo]}20`,
                  color: EVENT_COLORS[event.tipo],
                }}
              >
                {EVENT_LABELS[event.tipo]}
              </Badge>
            </div>
            {event.publico && (
              <Badge variant="secondary">Publico</Badge>
            )}
          </div>

          <Separator />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>
                {format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>
                {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
              </span>
            </div>
            {event.local && event.local !== '-' && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{event.local}</span>
              </div>
            )}
          </div>

          {event.descricao && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Descricao</p>
                <p className="text-sm text-muted-foreground">{event.descricao}</p>
              </div>
            </>
          )}

          {/* Game-specific info */}
          {event.tipo === 'jogo' && (event.adversario || event.competicao) && (
            <>
              <Separator />
              <div className="grid gap-3 sm:grid-cols-2">
                {event.adversario && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>
                      <span className="text-muted-foreground">Adversario: </span>
                      <span className="font-medium">{event.adversario}</span>
                    </span>
                  </div>
                )}
                {event.competicao && (
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>
                      <span className="text-muted-foreground">Competicao: </span>
                      <span className="font-medium">{event.competicao}</span>
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </Card>

        {/* Attendance section */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">Presenca</h3>
            </div>
            <Badge variant="secondary">
              {confirmedCount}/{attendance.length} confirmados
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            {attendance.map((entry) => (
              <div
                key={entry.atletaId}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={entry.athlete.foto}
                    alt={entry.athlete.nome}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">{entry.athlete.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      #{entry.athlete.numeroCamisa}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    CONFIRMATION_STYLES[entry.status]
                  }`}
                >
                  {CONFIRMATION_LABELS[entry.status]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

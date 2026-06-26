import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCalendarStore } from '@/store/calendarStore'
import { useConvocationStore } from '@/store/convocationStore'
import { usePermissions } from '@/hooks/usePermissions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CheckCircle2,
  Clock,
  MapPin,
  Trophy,
  XCircle,
  ClipboardCheck,
  Users,
  ChevronRight,
} from 'lucide-react'

export function ConvocationPage() {
  const navigate = useNavigate()
  const { canManageConvocation } = usePermissions()
  const events = useCalendarStore((s) => s.events)
  const convocations = useConvocationStore((s) => s.convocations)

  const upcomingGames = events
    .filter((e) => e.tipo === 'jogo' && new Date(e.dataInicio) > new Date())
    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())

  // ===== Visao do treinador / direcao: gerenciar convocacoes =====
  if (canManageConvocation) {
    return (
      <div className="flex flex-col">
        <TopBar title="Convocacoes" subtitle="Monte a convocacao para cada jogo" />
        <div className="p-4 md:p-6 space-y-4">
          {upcomingGames.length > 0 ? (
            upcomingGames.map((game) => {
              const convocation = convocations.find((c) => c.eventoId === game.id)
              const total = convocation?.atletasConvocados.length ?? 0
              return (
                <Card key={game.id} className="border-l-4 border-l-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-slate-700" />
                        <CardTitle className="text-lg">{game.titulo}</CardTitle>
                      </div>
                      {convocation ? (
                        <Badge className="bg-green-100 text-green-800">
                          {total} convocados
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Sem convocacao</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {game.competicao && (
                      <Badge variant="secondary" className="mb-3">
                        {game.competicao}
                      </Badge>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(game.dataInicio), "EEEE, dd/MM 'as' HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {game.local}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={() => navigate(`/convocacao/preparar/${game.id}`)}
                        className="bg-slate-800 hover:bg-slate-700"
                      >
                        <ClipboardCheck className="w-4 h-4 mr-2" />
                        {convocation ? 'Editar Convocacao' : 'Fazer Convocacao'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">Nenhum jogo agendado</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/calendario')}
              >
                Ir ao Calendario
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ===== Visao do atleta: confirmar presenca =====
  return <AthleteConvocationView upcomingGames={upcomingGames} />
}

function AthleteConvocationView({
  upcomingGames,
}: {
  upcomingGames: ReturnType<typeof useCalendarStore.getState>['events']
}) {
  const navigate = useNavigate()
  const [confirmations, setConfirmations] = useState<
    Record<string, 'confirmado' | 'ausencia'>
  >({})

  const handleConfirm = (eventId: string, status: 'confirmado' | 'ausencia') => {
    setConfirmations((prev) => ({ ...prev, [eventId]: status }))
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Convocacoes" subtitle="Suas convocacoes e confirmacoes" />
      <div className="p-4 md:p-6 space-y-4">
        {upcomingGames.length > 0 ? (
          upcomingGames.map((game) => {
            const status = confirmations[game.id]
            return (
              <Card key={game.id} className="border-l-4 border-l-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-slate-700" />
                      <CardTitle className="text-lg">
                        Clube Pro vs {game.adversario}
                      </CardTitle>
                    </div>
                    {status && (
                      <Badge
                        className={
                          status === 'confirmado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {status === 'confirmado' ? 'Confirmado' : 'Ausencia'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {game.competicao && (
                    <Badge variant="secondary" className="mb-3">
                      {game.competicao}
                    </Badge>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(game.dataInicio), "EEEE, dd/MM 'as' HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {game.local}
                    </span>
                  </div>
                  {!status && (
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={() => handleConfirm(game.id, 'confirmado')}
                        className="bg-slate-800 hover:bg-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirmar Presenca
                      </Button>
                      <Button
                        variant="outline"
                        className="text-destructive border-destructive hover:bg-destructive/5"
                        onClick={() => handleConfirm(game.id, 'ausencia')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Informar Ausencia
                      </Button>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/calendario/evento/${game.id}`)}
                    className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Ver convocados
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">Nenhuma convocacao pendente</p>
          </div>
        )}
      </div>
    </div>
  )
}

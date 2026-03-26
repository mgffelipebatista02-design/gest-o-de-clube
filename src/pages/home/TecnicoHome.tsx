import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockAthletes } from '@/data/mockAthletes'
import { mockEvents } from '@/data/mockEvents'
import { EVENT_COLORS, POSITION_LABELS } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import {
  Users, ClipboardList, Trophy, MapPin, Clock,
  CheckCircle2, XCircle, AlertCircle, UserCheck,
} from 'lucide-react'

export function TecnicoHome() {
  const navigate = useNavigate()
  const now = new Date()

  const nextGame = mockEvents
    .filter((e) => e.tipo === 'jogo' && new Date(e.dataInicio) > now)
    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())[0]

  const availableAthletes = mockAthletes.filter((a) => a.status === 'ativo')
  const injuredAthletes = mockAthletes.filter((a) => a.status === 'lesionado')
  const suspendedAthletes = mockAthletes.filter((a) => a.status === 'suspenso')

  // Mock confirmations
  const mockConfirmations = {
    confirmed: 15,
    pending: 5,
    absent: 2,
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Home" subtitle="Visao do Tecnico" />
      <div className="p-4 md:p-6 space-y-6">
        {/* Proximo Jogo */}
        {nextGame && (
          <Card className="border-l-4" style={{ borderLeftColor: EVENT_COLORS.jogo }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-clube-error" />
                <CardTitle className="text-lg">Proximo Jogo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold">Clube Pro vs {nextGame.adversario}</p>
                  {nextGame.competicao && (
                    <Badge variant="secondary" className="mt-1">{nextGame.competicao}</Badge>
                  )}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {format(new Date(nextGame.dataInicio), "EEEE, dd/MM 'as' HH:mm", { locale: ptBR })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {nextGame.local}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => navigate('/escalacao')} className="bg-primary">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Escalar Time
                </Button>
                <Button variant="outline" onClick={() => navigate(`/calendario/evento/${nextGame.id}`)}>
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Elenco Disponivel */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Elenco Disponivel</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aptos</span>
                  <span className="text-2xl font-bold text-clube-success">{availableAthletes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lesionados</span>
                  <span className="text-lg font-semibold text-clube-error">{injuredAthletes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Suspensos</span>
                  <span className="text-lg font-semibold text-clube-warning">{suspendedAthletes.length}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/elenco')}>
                Ver Elenco Completo
              </Button>
            </CardContent>
          </Card>

          {/* Confirmacoes Pendentes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-clube-info" />
                <CardTitle className="text-base">Confirmacoes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-clube-success" />
                  <span className="text-sm">{mockConfirmations.confirmed} confirmados</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-clube-warning" />
                  <span className="text-sm">{mockConfirmations.pending} pendentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-clube-error" />
                  <span className="text-sm">{mockConfirmations.absent} ausencias</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proximos Treinos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Proximos Treinos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEvents
                  .filter((e) => e.tipo === 'treino' && new Date(e.dataInicio) > now)
                  .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())
                  .slice(0, 3)
                  .map((e) => (
                    <div key={e.id} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-8 rounded-full bg-clube-success" />
                      <div>
                        <p className="font-medium">{e.titulo}</p>
                        <p className="text-muted-foreground">
                          {format(new Date(e.dataInicio), "dd/MM 'as' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lesionados */}
        {injuredAthletes.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Atletas Lesionados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {injuredAthletes.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                  >
                    <img src={a.foto} alt={a.nome} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-sm">{a.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {POSITION_LABELS[a.posicao]} | #{a.numeroCamisa}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

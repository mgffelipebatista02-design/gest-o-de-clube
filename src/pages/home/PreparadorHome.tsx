import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockEvents } from '@/data/mockEvents'
import { mockAthletes } from '@/data/mockAthletes'
import { mockInjuries } from '@/data/mockInjuries'
import { EVENT_COLORS } from '@/types'
import { format, isThisWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import {
  Dumbbell, Calendar, Users, AlertTriangle, CheckCircle2,
} from 'lucide-react'

export function PreparadorHome() {
  const navigate = useNavigate()

  const weekTrainings = mockEvents.filter(
    (e) => (e.tipo === 'treino' || e.tipo === 'academia') && isThisWeek(new Date(e.dataInicio))
  )
  const completedTrainings = weekTrainings.filter((e) => new Date(e.dataFim) < new Date())
  const upcomingTrainings = weekTrainings
    .filter((e) => new Date(e.dataInicio) > new Date())
    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())

  const avgPresence = mockAthletes.reduce((acc, a) => {
    if (a.totalTreinos > 0) return acc + (a.presencaTreinos / a.totalTreinos)
    return acc
  }, 0) / mockAthletes.length * 100

  const restrictedAthletes = mockAthletes.filter((a) => a.status === 'lesionado')
  const transitionInjuries = mockInjuries.filter((i) => i.status === 'em-transicao')

  return (
    <div className="flex flex-col">
      <TopBar title="Home" subtitle="Preparacao Fisica" />
      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <Dumbbell className="w-6 h-6 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold">{weekTrainings.length}</p>
              <p className="text-xs text-muted-foreground">Treinos na Semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto text-clube-success mb-1" />
              <p className="text-2xl font-bold">{completedTrainings.length}</p>
              <p className="text-xs text-muted-foreground">Realizados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Users className="w-6 h-6 mx-auto text-clube-info mb-1" />
              <p className="text-2xl font-bold">{Math.round(avgPresence)}%</p>
              <p className="text-xs text-muted-foreground">Presenca Media</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <AlertTriangle className="w-6 h-6 mx-auto text-clube-warning mb-1" />
              <p className="text-2xl font-bold">{restrictedAthletes.length}</p>
              <p className="text-xs text-muted-foreground">Com Restricao</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button onClick={() => navigate('/calendario')} className="bg-primary">
            <Calendar className="w-4 h-4 mr-2" />
            Programar Treino
          </Button>
          <Button variant="outline" onClick={() => navigate('/elenco')}>
            <Users className="w-4 h-4 mr-2" />
            Registrar Presenca
          </Button>
        </div>

        {/* Proximos Treinos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Proximos Treinos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTrainings.map((e) => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div
                    className="w-1.5 h-10 rounded-full"
                    style={{ backgroundColor: EVENT_COLORS[e.tipo] }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{e.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(e.dataInicio), "EEEE, dd/MM 'as' HH:mm", { locale: ptBR })} - {e.local}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">{e.tipo}</Badge>
                </div>
              ))}
              {upcomingTrainings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum treino programado para esta semana
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Atletas com Restricao */}
        {(restrictedAthletes.length > 0 || transitionInjuries.length > 0) && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-clube-warning" />
                <CardTitle className="text-base">Atletas com Restricao</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {restrictedAthletes.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-2 rounded bg-red-50">
                    <div className="flex items-center gap-2">
                      <img src={a.foto} alt={a.nome} className="w-8 h-8 rounded-full" />
                      <span className="text-sm font-medium">{a.nome}</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">Lesionado</Badge>
                  </div>
                ))}
                {transitionInjuries.map((i) => {
                  const athlete = mockAthletes.find((a) => a.id === i.atletaId)
                  if (!athlete) return null
                  return (
                    <div key={i.id} className="flex items-center justify-between p-2 rounded bg-yellow-50">
                      <div className="flex items-center gap-2">
                        <img src={athlete.foto} alt={athlete.nome} className="w-8 h-8 rounded-full" />
                        <span className="text-sm font-medium">{athlete.nome}</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Em Transicao</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

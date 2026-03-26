import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'
import { mockEvents } from '@/data/mockEvents'
import { mockInjuries } from '@/data/mockInjuries'
import { EVENT_COLORS } from '@/types'
import type { Athlete } from '@/types'
import { format, isToday, isTomorrow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar, CheckCircle2, Trophy, Activity,
  Target, Clock, MapPin, HeartPulse,
} from 'lucide-react'
import { useState } from 'react'

export function AtletaHome() {
  const user = useAuthStore((s) => s.user) as Athlete | null
  const [convocationConfirmed, setConvocationConfirmed] = useState(false)
  const now = new Date()

  if (!user) return null

  const todayEvents = mockEvents.filter((e) => {
    const eventDate = new Date(e.dataInicio)
    return isToday(eventDate) || isTomorrow(eventDate)
  }).sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())

  const nextGame = mockEvents
    .filter((e) => e.tipo === 'jogo' && new Date(e.dataInicio) > now)
    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())[0]

  const activeInjury = mockInjuries.find(
    (i) => i.atletaId === user.id && i.status !== 'liberado'
  )

  const presencaPercent = user.totalTreinos > 0
    ? Math.round((user.presencaTreinos / user.totalTreinos) * 100)
    : 0

  return (
    <div className="flex flex-col">
      <TopBar title="Home" subtitle={`Ola, ${user.nome.split(' ')[0]}!`} />
      <div className="p-4 md:p-6 space-y-6">
        {/* Convocacao */}
        {nextGame && (
          <Card className="border-l-4 border-l-clube-error">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-clube-error" />
                  <CardTitle className="text-lg">Convocacao</CardTitle>
                </div>
                <Badge className="bg-green-100 text-green-800">Convocado</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">Clube Pro vs {nextGame.adversario}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {format(new Date(nextGame.dataInicio), "dd/MM 'as' HH:mm", { locale: ptBR })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {nextGame.local}
                </span>
              </div>
              <div className="mt-4">
                {convocationConfirmed ? (
                  <div className="flex items-center gap-2 text-clube-success">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Presenca confirmada!</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => setConvocationConfirmed(true)}
                    className="bg-primary"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Convocado
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <Target className="w-6 h-6 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold">{user.gols}</p>
              <p className="text-xs text-muted-foreground">Gols</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Activity className="w-6 h-6 mx-auto text-clube-info mb-1" />
              <p className="text-2xl font-bold">{user.assistencias}</p>
              <p className="text-xs text-muted-foreground">Assistencias</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Trophy className="w-6 h-6 mx-auto text-clube-warning mb-1" />
              <p className="text-2xl font-bold">{user.jogosDisputados}</p>
              <p className="text-xs text-muted-foreground">Jogos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Calendar className="w-6 h-6 mx-auto text-clube-success mb-1" />
              <p className="text-2xl font-bold">{presencaPercent}%</p>
              <p className="text-xs text-muted-foreground">Presenca</p>
            </CardContent>
          </Card>
        </div>

        {/* Minha Agenda */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Minha Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            {todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map((e) => (
                  <div key={e.id} className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-10 rounded-full"
                      style={{ backgroundColor: EVENT_COLORS[e.tipo] }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{e.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(e.dataInicio), "dd/MM 'as' HH:mm", { locale: ptBR })} - {e.local}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {isToday(new Date(e.dataInicio)) ? 'Hoje' : 'Amanha'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum compromisso para hoje ou amanha
              </p>
            )}
          </CardContent>
        </Card>

        {/* Status Clinico */}
        {activeInjury && (
          <Card className="border-l-4 border-l-clube-error">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-clube-error" />
                <CardTitle className="text-base">Status Clinico</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{activeInjury.tipo} - {activeInjury.regiao}</p>
                <div className="flex gap-2">
                  <Badge variant={activeInjury.status === 'em-tratamento' ? 'destructive' : 'secondary'}>
                    {activeInjury.status === 'em-tratamento' ? 'Em Tratamento' : 'Em Transicao'}
                  </Badge>
                  <Badge variant="outline">{activeInjury.gravidade}</Badge>
                </div>
                {activeInjury.previsaoRetorno && (
                  <p className="text-sm text-muted-foreground">
                    Previsao de retorno: {format(new Date(activeInjury.previsaoRetorno), 'dd/MM/yyyy')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

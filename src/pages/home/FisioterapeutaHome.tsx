import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockInjuries } from '@/data/mockInjuries'
import { mockAthletes } from '@/data/mockAthletes'
import { useNavigate } from 'react-router-dom'
import { format, differenceInDays } from 'date-fns'
import {
  HeartPulse, UserPlus, ClipboardCheck, AlertTriangle, CheckCircle2,
} from 'lucide-react'

const SEVERITY_COLORS = {
  leve: 'bg-yellow-100 text-yellow-800',
  moderada: 'bg-orange-100 text-orange-800',
  grave: 'bg-red-100 text-red-800',
}

export function FisioterapeutaHome() {
  const navigate = useNavigate()

  const activeInjuries = mockInjuries
    .filter((i) => i.status !== 'liberado')
    .sort((a, b) => {
      const order = { grave: 0, moderada: 1, leve: 2 }
      return (order[a.gravidade] ?? 2) - (order[b.gravidade] ?? 2)
    })

  const recentlyCleared = mockInjuries
    .filter((i) => i.status === 'liberado' && i.dataLiberacao)
    .sort((a, b) => new Date(b.dataLiberacao!).getTime() - new Date(a.dataLiberacao!).getTime())
    .slice(0, 3)

  const getAthleteName = (id: string) =>
    mockAthletes.find((a) => a.id === id)?.nome ?? 'Desconhecido'

  return (
    <div className="flex flex-col">
      <TopBar title="Home" subtitle="Departamento Medico" />
      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <AlertTriangle className="w-6 h-6 mx-auto text-clube-error mb-1" />
              <p className="text-2xl font-bold">{activeInjuries.length}</p>
              <p className="text-xs text-muted-foreground">Em Tratamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <HeartPulse className="w-6 h-6 mx-auto text-clube-warning mb-1" />
              <p className="text-2xl font-bold">
                {mockInjuries.filter((i) => i.status === 'em-transicao').length}
              </p>
              <p className="text-xs text-muted-foreground">Em Transicao</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto text-clube-success mb-1" />
              <p className="text-2xl font-bold">{recentlyCleared.length}</p>
              <p className="text-xs text-muted-foreground">Liberados (7d)</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button onClick={() => navigate('/clinico')} className="bg-primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Registrar Lesao
          </Button>
          <Button variant="outline" onClick={() => navigate('/clinico')}>
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Atualizar Tratamento
          </Button>
        </div>

        {/* Pacientes Ativos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pacientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeInjuries.map((injury) => {
                const days = differenceInDays(new Date(), new Date(injury.dataRegistro))
                return (
                  <div
                    key={injury.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/clinico')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{getAthleteName(injury.atletaId)}</p>
                        <p className="text-xs text-muted-foreground">
                          {injury.tipo} - {injury.regiao}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={SEVERITY_COLORS[injury.gravidade]}>
                        {injury.gravidade}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{days}d</span>
                    </div>
                  </div>
                )
              })}
              {activeInjuries.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum paciente ativo no momento
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liberacoes Recentes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Liberacoes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyCleared.map((injury) => (
                <div key={injury.id} className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-clube-success" />
                    <div>
                      <p className="font-medium text-sm">{getAthleteName(injury.atletaId)}</p>
                      <p className="text-xs text-muted-foreground">{injury.tipo} - {injury.regiao}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(injury.dataLiberacao!), 'dd/MM/yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

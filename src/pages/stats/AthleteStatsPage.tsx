import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import type { Athlete } from '@/types'
import { POSITION_LABELS } from '@/types'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { Trophy, Target, Activity, Calendar, Clock, CreditCard } from 'lucide-react'

export function AthleteStatsPage() {
  const user = useAuthStore((s) => s.user) as Athlete | null
  if (!user || user.role !== 'atleta') return null

  const presencaPercent = user.totalTreinos > 0
    ? Math.round((user.presencaTreinos / user.totalTreinos) * 100)
    : 0

  const radarData = [
    { attr: 'Gols', value: Math.min(user.gols * 8, 100) },
    { attr: 'Assist', value: Math.min(user.assistencias * 8, 100) },
    { attr: 'Presenca', value: presencaPercent },
    { attr: 'Titular', value: user.jogosDisputados > 0 ? Math.round((user.jogosTitular / user.jogosDisputados) * 100) : 0 },
    { attr: 'Minutos', value: Math.min(Math.round(user.minutosJogados / 30), 100) },
    { attr: 'Disciplina', value: Math.max(100 - (user.cartoesAmarelos * 10 + user.cartoesVermelhos * 25), 0) },
  ]

  const evolutionData = [
    { mes: 'Out', nota: 6.5 }, { mes: 'Nov', nota: 7.0 }, { mes: 'Dez', nota: 7.2 },
    { mes: 'Jan', nota: 7.5 }, { mes: 'Fev', nota: 7.8 }, { mes: 'Mar', nota: 8.0 },
  ]

  return (
    <div className="flex flex-col">
      <TopBar title="Minhas Estatisticas" subtitle={`${user.nome} - ${POSITION_LABELS[user.posicao]}`} />
      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: Trophy, label: 'Jogos', value: user.jogosDisputados, color: 'text-primary' },
            { icon: Target, label: 'Gols', value: user.gols, color: 'text-clube-success' },
            { icon: Activity, label: 'Assistencias', value: user.assistencias, color: 'text-clube-info' },
            { icon: Calendar, label: 'Presenca', value: `${presencaPercent}%`, color: 'text-clube-warning' },
            { icon: Clock, label: 'Minutos', value: user.minutosJogados, color: 'text-muted-foreground' },
            { icon: CreditCard, label: 'Cartoes', value: `${user.cartoesAmarelos}A / ${user.cartoesVermelhos}V`, color: 'text-yellow-600' },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label}>
              <CardContent className="pt-4 text-center">
                <Icon className={`w-6 h-6 mx-auto mb-1 ${color}`} />
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Radar de Desempenho</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="attr" fontSize={12} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar dataKey="value" stroke="#1B5E20" fill="#4CAF50" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Evolucao de Desempenho</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" fontSize={12} />
                  <YAxis domain={[0, 10]} fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="nota" name="Nota" stroke="#1B5E20" strokeWidth={2} dot={{ fill: '#1B5E20' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

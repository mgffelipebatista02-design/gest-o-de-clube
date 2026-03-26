import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockAthletes } from '@/data/mockAthletes'
import { POSITION_LABELS, STATUS_COLORS } from '@/types'
import type { Athlete } from '@/types'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  LineChart, Line,
} from 'recharts'
import { TrendingUp, Users, Target } from 'lucide-react'

export function ReportsPage() {
  const navigate = useNavigate()
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null)

  const goalsData = mockAthletes
    .filter((a) => a.gols > 0)
    .sort((a, b) => b.gols - a.gols)
    .slice(0, 8)
    .map((a) => ({ nome: a.nome.split(' ')[0], gols: a.gols, assistencias: a.assistencias }))

  const attendanceData = mockAthletes
    .sort((a, b) => {
      const pctA = a.totalTreinos > 0 ? a.presencaTreinos / a.totalTreinos : 0
      const pctB = b.totalTreinos > 0 ? b.presencaTreinos / b.totalTreinos : 0
      return pctB - pctA
    })
    .slice(0, 10)
    .map((a) => ({
      nome: a.nome.split(' ')[0],
      presenca: a.totalTreinos > 0 ? Math.round((a.presencaTreinos / a.totalTreinos) * 100) : 0,
    }))

  const selectedAthlete = selectedAthleteId ? mockAthletes.find((a) => a.id === selectedAthleteId) : null

  const getRadarData = (athlete: Athlete) => [
    { attr: 'Gols', value: Math.min(athlete.gols * 8, 100) },
    { attr: 'Assist', value: Math.min(athlete.assistencias * 8, 100) },
    { attr: 'Presenca', value: athlete.totalTreinos > 0 ? Math.round((athlete.presencaTreinos / athlete.totalTreinos) * 100) : 0 },
    { attr: 'Titular', value: athlete.jogosDisputados > 0 ? Math.round((athlete.jogosTitular / athlete.jogosDisputados) * 100) : 0 },
    { attr: 'Minutos', value: Math.min(Math.round(athlete.minutosJogados / 30), 100) },
    { attr: 'Disciplina', value: Math.max(100 - (athlete.cartoesAmarelos * 10 + athlete.cartoesVermelhos * 25), 0) },
  ]

  // Mock evolution data
  const evolutionData = [
    { mes: 'Out', nota: 6.5 }, { mes: 'Nov', nota: 7.0 }, { mes: 'Dez', nota: 6.8 },
    { mes: 'Jan', nota: 7.5 }, { mes: 'Fev', nota: 7.2 }, { mes: 'Mar', nota: 8.0 },
  ]

  return (
    <div className="flex flex-col">
      <TopBar title="Relatorios" subtitle="Desempenho e estatisticas do elenco" />
      <div className="p-4 md:p-6 space-y-6">
        {/* Overview Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Artilharia e Assistencias</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={goalsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gols" name="Gols" fill="#1B5E20" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="assistencias" name="Assistencias" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-clube-info" />
                <CardTitle className="text-base">Presenca em Treinos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} fontSize={12} />
                  <YAxis type="category" dataKey="nome" fontSize={12} width={80} />
                  <Tooltip formatter={(value: unknown) => `${value}%`} />
                  <Bar dataKey="presenca" name="Presenca %" fill="#1565C0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Athlete Selector + Detail */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <CardTitle className="text-base">Relatorio Individual</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
              {mockAthletes.filter((a) => a.status !== 'desligado').map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAthleteId(a.id === selectedAthleteId ? null : a.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition-all ${
                    selectedAthleteId === a.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'
                  }`}
                >
                  <img src={a.foto} alt={a.nome} className="w-7 h-7 rounded-full" />
                  <div className="min-w-0">
                    <p className="font-medium truncate text-xs">{a.nome.split(' ')[0]}</p>
                    <p className="text-[10px] text-muted-foreground">#{a.numeroCamisa}</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedAthlete && (
              <div className="space-y-6 border-t pt-6">
                {/* Athlete Header */}
                <div className="flex items-center gap-4">
                  <img src={selectedAthlete.foto} alt={selectedAthlete.nome} className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="text-xl font-bold">{selectedAthlete.nome}</h3>
                    <p className="text-muted-foreground">
                      {POSITION_LABELS[selectedAthlete.posicao]} | #{selectedAthlete.numeroCamisa}
                    </p>
                  </div>
                  <Badge
                    className="ml-auto"
                    style={{ backgroundColor: STATUS_COLORS[selectedAthlete.status] + '20', color: STATUS_COLORS[selectedAthlete.status] }}
                  >
                    {selectedAthlete.status}
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { label: 'Jogos', value: selectedAthlete.jogosDisputados },
                    { label: 'Titular', value: selectedAthlete.jogosTitular },
                    { label: 'Gols', value: selectedAthlete.gols },
                    { label: 'Assist', value: selectedAthlete.assistencias },
                    { label: 'Amarelos', value: selectedAthlete.cartoesAmarelos },
                    { label: 'Vermelhos', value: selectedAthlete.cartoesVermelhos },
                    { label: 'Minutos', value: selectedAthlete.minutosJogados },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Radar de Desempenho</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={getRadarData(selectedAthlete)}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="attr" fontSize={12} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} />
                        <Radar dataKey="value" stroke="#1B5E20" fill="#4CAF50" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Evolucao de Desempenho</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={evolutionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" fontSize={12} />
                        <YAxis domain={[0, 10]} fontSize={12} />
                        <Tooltip />
                        <Line type="monotone" dataKey="nota" stroke="#1B5E20" strokeWidth={2} dot={{ fill: '#1B5E20' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Full Squad Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resumo do Elenco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-semibold">#</th>
                    <th className="pb-3 font-semibold">Atleta</th>
                    <th className="pb-3 font-semibold">Pos</th>
                    <th className="pb-3 font-semibold text-center">J</th>
                    <th className="pb-3 font-semibold text-center">T</th>
                    <th className="pb-3 font-semibold text-center">G</th>
                    <th className="pb-3 font-semibold text-center">A</th>
                    <th className="pb-3 font-semibold text-center">CA</th>
                    <th className="pb-3 font-semibold text-center">CV</th>
                    <th className="pb-3 font-semibold text-center">Min</th>
                    <th className="pb-3 font-semibold text-center">%P</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAthletes
                    .filter((a) => a.status !== 'desligado')
                    .sort((a, b) => b.jogosDisputados - a.jogosDisputados)
                    .map((a) => (
                      <tr
                        key={a.id}
                        className="border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                        onClick={() => navigate(`/elenco/${a.id}`)}
                      >
                        <td className="py-2.5 font-bold text-primary">{a.numeroCamisa}</td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <img src={a.foto} alt={a.nome} className="w-6 h-6 rounded-full" />
                            <span className="font-medium">{a.nome}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-muted-foreground">{POSITION_LABELS[a.posicao].substring(0, 3)}</td>
                        <td className="py-2.5 text-center">{a.jogosDisputados}</td>
                        <td className="py-2.5 text-center">{a.jogosTitular}</td>
                        <td className="py-2.5 text-center font-medium">{a.gols}</td>
                        <td className="py-2.5 text-center">{a.assistencias}</td>
                        <td className="py-2.5 text-center">{a.cartoesAmarelos}</td>
                        <td className="py-2.5 text-center">{a.cartoesVermelhos}</td>
                        <td className="py-2.5 text-center">{a.minutosJogados}</td>
                        <td className="py-2.5 text-center">
                          {a.totalTreinos > 0 ? Math.round((a.presencaTreinos / a.totalTreinos) * 100) : 0}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, isAfter, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Users,
  TrendingUp,
  HeartPulse,
  DollarSign,
  CalendarPlus,
  BarChart3,
  AlertTriangle,
  Clock,
  MapPin,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TopBar } from '@/components/layout/TopBar'
import { mockAthletes } from '@/data/mockAthletes'
import { mockEvents } from '@/data/mockEvents'
import { mockInjuries } from '@/data/mockInjuries'
import { mockPayments } from '@/data/mockPayments'
import { EVENT_COLORS } from '@/types'
import type { ClubEvent } from '@/types'

const STATUS_PIE_COLORS: Record<string, string> = {
  ativo: '#2E7D32',
  lesionado: '#C62828',
  emprestado: '#1565C0',
  desligado: '#757575',
  suspenso: '#F9A825',
}

const CATEGORY_BAR_DATA = [
  { categoria: 'Sub-15', presenca: 82 },
  { categoria: 'Sub-17', presenca: 88 },
  { categoria: 'Sub-20', presenca: 75 },
  { categoria: 'Profissional', presenca: 91 },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const now = new Date()

  // Stats
  const atletasAtivos = useMemo(
    () => mockAthletes.filter((a) => a.status === 'ativo').length,
    []
  )

  const presencaMedia = useMemo(() => {
    const athletes = mockAthletes.filter((a) => a.totalTreinos > 0)
    if (athletes.length === 0) return 0
    const total = athletes.reduce(
      (acc, a) => acc + (a.presencaTreinos / a.totalTreinos) * 100,
      0
    )
    return Math.round(total / athletes.length)
  }, [])

  const lesoesAbertas = useMemo(
    () => mockInjuries.filter((i) => i.status !== 'liberado').length,
    []
  )

  const pagamentosPendentes = useMemo(
    () =>
      mockPayments.filter(
        (p) => p.status === 'pendente' || p.status === 'atrasado'
      ).length,
    []
  )

  // Upcoming events
  const proximosEventos = useMemo(() => {
    return mockEvents
      .filter((e) => isAfter(parseISO(e.dataInicio), now))
      .sort(
        (a, b) =>
          parseISO(a.dataInicio).getTime() - parseISO(b.dataInicio).getTime()
      )
      .slice(0, 3)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Alerts
  const alerts = useMemo(() => {
    const items: { text: string; color: string; type: string }[] = []

    const overduePayments = mockPayments.filter((p) => p.status === 'atrasado')
    if (overduePayments.length > 0) {
      items.push({
        text: `${overduePayments.length} pagamento(s) em atraso`,
        color: '#C62828',
        type: 'error',
      })
    }

    const activeInjuries = mockInjuries.filter((i) => i.status === 'em-tratamento')
    if (activeInjuries.length > 0) {
      items.push({
        text: `${activeInjuries.length} atleta(s) em tratamento`,
        color: '#F9A825',
        type: 'warning',
      })
    }

    const expiringContracts = mockAthletes.filter((a) => {
      if (!a.contratoFim) return false
      const end = parseISO(a.contratoFim)
      const diffDays =
        (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      return diffDays > 0 && diffDays <= 90
    })
    if (expiringContracts.length > 0) {
      items.push({
        text: `${expiringContracts.length} contrato(s) vencem em ate 90 dias`,
        color: '#1565C0',
        type: 'info',
      })
    }

    const pendingPayments = mockPayments.filter((p) => p.status === 'pendente')
    if (pendingPayments.length > 0) {
      items.push({
        text: `${pendingPayments.length} pagamento(s) pendente(s)`,
        color: '#F9A825',
        type: 'warning',
      })
    }

    return items
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pie chart data
  const pieData = useMemo(() => {
    const statusCount: Record<string, number> = {}
    mockAthletes.forEach((a) => {
      statusCount[a.status] = (statusCount[a.status] || 0) + 1
    })
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }))
  }, [])

  const statCards = [
    {
      label: 'Atletas Ativos',
      value: atletasAtivos,
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-[#2E7D32]',
    },
    {
      label: 'Presenca Media',
      value: `${presencaMedia}%`,
      icon: TrendingUp,
      bgColor: 'bg-blue-100',
      iconColor: 'text-[#1565C0]',
    },
    {
      label: 'Lesoes Abertas',
      value: lesoesAbertas,
      icon: HeartPulse,
      bgColor: 'bg-red-100',
      iconColor: 'text-[#C62828]',
    },
    {
      label: 'Pgtos Pendentes',
      value: pagamentosPendentes,
      icon: DollarSign,
      bgColor: 'bg-amber-100',
      iconColor: 'text-[#F9A825]',
    },
  ]

  const statusLabels: Record<string, string> = {
    ativo: 'Ativo',
    lesionado: 'Lesionado',
    emprestado: 'Emprestado',
    desligado: 'Desligado',
    suspenso: 'Suspenso',
  }

  const formatEventDate = (event: ClubEvent) => {
    const date = parseISO(event.dataInicio)
    return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })
  }

  const formatEventTime = (event: ClubEvent) => {
    const start = parseISO(event.dataInicio)
    const end = parseISO(event.dataFim)
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <TopBar title="Dashboard" subtitle="Visao geral do clube" />

      <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Events + Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Upcoming Events */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Proximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {proximosEventos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum evento futuro cadastrado.
                </p>
              ) : (
                proximosEventos.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    style={{
                      borderLeft: `4px solid ${EVENT_COLORS[event.tipo]}`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium truncate">
                          {event.titulo}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-[10px] shrink-0"
                          style={{
                            backgroundColor: `${EVENT_COLORS[event.tipo]}15`,
                            color: EVENT_COLORS[event.tipo],
                          }}
                        >
                          {event.tipo}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatEventDate(event)} | {formatEventTime(event)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.local}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F9A825]" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum alerta no momento.
                </p>
              ) : (
                alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-lg text-sm"
                    style={{
                      backgroundColor: `${alert.color}10`,
                      borderLeft: `3px solid ${alert.color}`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: alert.color }}
                    />
                    <span className="text-foreground/80">{alert.text}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie Chart - Squad by Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Elenco</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_PIE_COLORS[entry.name] || '#9E9E9E'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown, name: unknown) => [
                        String(value),
                        statusLabels[String(name)] || String(name),
                      ]}
                    />
                    <Legend
                      formatter={(value: string) =>
                        statusLabels[value] || value
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart - Attendance by Category */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Presenca por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CATEGORY_BAR_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis
                      dataKey="categoria"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      unit="%"
                    />
                    <Tooltip
                      formatter={(value: unknown) => [`${value}%`, 'Presenca']}
                    />
                    <Bar
                      dataKey="presenca"
                      fill="#4CAF50"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            className="bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-white"
            onClick={() => navigate('/calendario')}
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Criar Evento
          </Button>
          <Button
            variant="outline"
            className="border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20]/5"
            onClick={() => navigate('/relatorios')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Ver Relatorios
          </Button>
        </div>
      </main>
    </div>
  )
}

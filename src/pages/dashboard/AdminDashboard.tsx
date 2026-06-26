import { useMemo, useState } from 'react'
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
  Briefcase,
  UserCog,
  Filter,
  Timer,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TopBar } from '@/components/layout/TopBar'
import { mockAthletes } from '@/data/mockAthletes'
import { mockUsers } from '@/data/mockUsers'
import { mockEvents } from '@/data/mockEvents'
import { mockInjuries } from '@/data/mockInjuries'
import { mockPayments } from '@/data/mockPayments'
import { EVENT_COLORS } from '@/types'
import type { ClubEvent, Category, UserRole } from '@/types'

const STATUS_PIE_COLORS: Record<string, string> = {
  ativo: '#059669',
  lesionado: '#DC2626',
  emprestado: '#2563EB',
  desligado: '#6B7280',
  suspenso: '#D97706',
}

const CATEGORY_LABELS: Record<Category, string> = {
  'sub-15': 'Sub-15',
  'sub-17': 'Sub-17',
  'sub-20': 'Sub-20',
  profissional: 'Profissional',
}

const ALL_CATEGORIES: Category[] = ['sub-15', 'sub-17', 'sub-20', 'profissional']

// Funcoes do clube exibidas no quadro de pessoal (funcionarios)
const STAFF_ROLES: { role: UserRole; label: string }[] = [
  { role: 'admin', label: 'Direcao' },
  { role: 'tecnico', label: 'Comissao Tecnica' },
  { role: 'preparador', label: 'Preparadores Fisicos' },
  { role: 'fisioterapeuta', label: 'Fisioterapeutas' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const now = new Date()

  // Filtro por escalao ('geral' = todos os escaloes)
  const [escalao, setEscalao] = useState<string>('geral')

  // Atletas do escalao selecionado (ou todos quando 'geral')
  const atletas = useMemo(
    () =>
      escalao === 'geral'
        ? mockAthletes
        : mockAthletes.filter((a) => a.categoria === escalao),
    [escalao]
  )

  // Ids dos atletas filtrados, para cruzar com lesoes/pagamentos
  const atletaIds = useMemo(
    () => new Set(atletas.map((a) => a.id)),
    [atletas]
  )

  // Stats (respeitam o escalao selecionado)
  const atletasAtivos = useMemo(
    () => atletas.filter((a) => a.status === 'ativo').length,
    [atletas]
  )

  const presencaMedia = useMemo(() => {
    const treinados = atletas.filter((a) => a.totalTreinos > 0)
    if (treinados.length === 0) return 0
    const total = treinados.reduce(
      (acc, a) => acc + (a.presencaTreinos / a.totalTreinos) * 100,
      0
    )
    return Math.round(total / treinados.length)
  }, [atletas])

  const lesoesAbertas = useMemo(
    () =>
      mockInjuries.filter(
        (i) => i.status !== 'liberado' && atletaIds.has(i.atletaId)
      ).length,
    [atletaIds]
  )

  const pagamentosPendentes = useMemo(
    () =>
      mockPayments.filter(
        (p) =>
          (p.status === 'pendente' || p.status === 'atrasado') &&
          atletaIds.has(p.atletaId)
      ).length,
    [atletaIds]
  )

  // Minutagem dos atletas (respeita o escalao selecionado)
  const minutosTotais = useMemo(
    () => atletas.reduce((acc, a) => acc + a.minutosJogados, 0),
    [atletas]
  )

  const minutagemMedia = useMemo(() => {
    const jogadores = atletas.filter((a) => a.jogosDisputados > 0)
    if (jogadores.length === 0) return 0
    const total = jogadores.reduce((acc, a) => acc + a.minutosJogados, 0)
    return Math.round(total / jogadores.length)
  }, [atletas])

  // Quadro de pessoal do clube (funcionarios sao sempre do clube inteiro)
  const totalFuncionarios = mockUsers.length
  const totalAtletas = atletas.length
  const totalPessoas = totalFuncionarios + totalAtletas

  const funcionariosPorFuncao = useMemo(
    () =>
      STAFF_ROLES.map((r) => ({
        ...r,
        count: mockUsers.filter((u) => u.role === r.role).length,
      })),
    []
  )

  // Presenca media real por escalao (comparativo, sempre do clube inteiro)
  const presencaPorCategoria = useMemo(
    () =>
      ALL_CATEGORIES.map((cat) => {
        const treinados = mockAthletes.filter(
          (a) => a.categoria === cat && a.totalTreinos > 0
        )
        const presenca =
          treinados.length === 0
            ? 0
            : Math.round(
                treinados.reduce(
                  (acc, a) => acc + (a.presencaTreinos / a.totalTreinos) * 100,
                  0
                ) / treinados.length
              )
        return { categoria: CATEGORY_LABELS[cat], presenca }
      }),
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

  // Alerts (respeitam o escalao selecionado)
  const alerts = useMemo(() => {
    const items: { text: string; color: string; type: string }[] = []

    const overduePayments = mockPayments.filter(
      (p) => p.status === 'atrasado' && atletaIds.has(p.atletaId)
    )
    if (overduePayments.length > 0) {
      items.push({
        text: `${overduePayments.length} pagamento(s) em atraso`,
        color: '#DC2626',
        type: 'error',
      })
    }

    const activeInjuries = mockInjuries.filter(
      (i) => i.status === 'em-tratamento' && atletaIds.has(i.atletaId)
    )
    if (activeInjuries.length > 0) {
      items.push({
        text: `${activeInjuries.length} atleta(s) em tratamento`,
        color: '#D97706',
        type: 'warning',
      })
    }

    const expiringContracts = atletas.filter((a) => {
      if (!a.contratoFim) return false
      const end = parseISO(a.contratoFim)
      const diffDays =
        (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      return diffDays > 0 && diffDays <= 90
    })
    if (expiringContracts.length > 0) {
      items.push({
        text: `${expiringContracts.length} contrato(s) vencem em ate 90 dias`,
        color: '#2563EB',
        type: 'info',
      })
    }

    const pendingPayments = mockPayments.filter(
      (p) => p.status === 'pendente' && atletaIds.has(p.atletaId)
    )
    if (pendingPayments.length > 0) {
      items.push({
        text: `${pendingPayments.length} pagamento(s) pendente(s)`,
        color: '#D97706',
        type: 'warning',
      })
    }

    return items
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atletas, atletaIds])

  // Pie chart data (respeita o escalao selecionado)
  const pieData = useMemo(() => {
    const statusCount: Record<string, number> = {}
    atletas.forEach((a) => {
      statusCount[a.status] = (statusCount[a.status] || 0) + 1
    })
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }))
  }, [atletas])

  const statCards = [
    {
      label: 'Atletas Ativos',
      value: atletasAtivos,
      icon: Users,
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-700',
    },
    {
      label: 'Presenca Media',
      value: `${presencaMedia}%`,
      icon: TrendingUp,
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      label: 'Lesoes Abertas',
      value: lesoesAbertas,
      icon: HeartPulse,
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      label: 'Pgtos Pendentes',
      value: pagamentosPendentes,
      icon: DollarSign,
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      label: 'Minutos Jogados',
      value: minutosTotais.toLocaleString('pt-BR'),
      icon: Clock,
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      label: 'Minutagem Media',
      value: `${minutagemMedia.toLocaleString('pt-BR')} min`,
      icon: Timer,
      bgColor: 'bg-slate-100',
      iconColor: 'text-slate-600',
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
    <div className="min-h-screen bg-background">
      <TopBar title="Dashboard" subtitle="Visao geral do clube" />

      <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Filtro por escalao */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Estatisticas do Clube
            </h2>
            <p className="text-sm text-muted-foreground">
              {escalao === 'geral'
                ? 'Visao geral de todos os escaloes'
                : `Filtrando por ${CATEGORY_LABELS[escalao as Category]}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select
              value={escalao}
              onValueChange={(v) => setEscalao(v ?? 'geral')}
            >
              <SelectTrigger className="min-w-44">
                <SelectValue placeholder="Escalao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Geral (todos)</SelectItem>
                {ALL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quadro de Pessoal do Clube */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              Quadro de Pessoal do Clube
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Total de Pessoas
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalPessoas}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Funcionarios
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalFuncionarios}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Users className="w-3 h-3" /> Atletas
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalAtletas}
                </p>
              </div>
              {funcionariosPorFuncao.map((f) => (
                <div key={f.role} className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <UserCog className="w-3 h-3" /> {f.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {f.count}
                  </p>
                </div>
              ))}
            </div>
            {escalao !== 'geral' && (
              <p className="mt-3 text-xs text-muted-foreground">
                O numero de funcionarios refere-se ao clube inteiro; apenas os
                atletas sao filtrados por escalao.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <AlertTriangle className="w-4 h-4 text-amber-600" />
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
                  <BarChart data={presencaPorCategoria}>
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
                      fill="#64748B"
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
            className="bg-slate-800 hover:bg-slate-700 text-white"
            onClick={() => navigate('/calendario')}
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Criar Evento
          </Button>
          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
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

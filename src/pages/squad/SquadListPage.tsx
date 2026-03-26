import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { mockAthletes } from '@/data/mockAthletes'
import type { Position, AthleteStatus } from '@/types'
import { POSITION_LABELS, STATUS_COLORS } from '@/types'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const STATUS_LABELS: Record<AthleteStatus, string> = {
  ativo: 'Ativo',
  lesionado: 'Lesionado',
  emprestado: 'Emprestado',
  desligado: 'Desligado',
  suspenso: 'Suspenso',
}

const ALL_POSITIONS: Position[] = [
  'goleiro',
  'zagueiro',
  'lateral-direito',
  'lateral-esquerdo',
  'volante',
  'meia',
  'ponta-direita',
  'ponta-esquerda',
  'centroavante',
  'atacante',
]

const ALL_STATUSES: AthleteStatus[] = ['ativo', 'lesionado', 'emprestado', 'desligado', 'suspenso']

export default function SquadListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState<string>('todas')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  const filtered = useMemo(() => {
    return mockAthletes.filter((a) => {
      const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase())
      const matchPosition = positionFilter === 'todas' || a.posicao === positionFilter
      const matchStatus = statusFilter === 'todos' || a.status === statusFilter
      return matchSearch && matchPosition && matchStatus
    })
  }, [search, positionFilter, statusFilter])

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Elenco" />

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar atleta..."
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={positionFilter} onValueChange={(v) => setPositionFilter(v ?? 'todas')}>
            <SelectTrigger>
              <SelectValue placeholder="Posicao" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as posicoes</SelectItem>
              {ALL_POSITIONS.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {POSITION_LABELS[pos]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'todos')}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {ALL_STATUSES.map((st) => (
                <SelectItem key={st} value={st}>
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[st] }}
                    />
                    {STATUS_LABELS[st]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {filtered.length} de {mockAthletes.length} atletas
          </span>
        </div>

        {/* Athlete grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((athlete) => (
            <Card
              key={athlete.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-primary/30"
              onClick={() => navigate(`/elenco/${athlete.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={athlete.foto}
                    alt={athlete.nome}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-background border text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {athlete.numeroCamisa}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{athlete.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {POSITION_LABELS[athlete.posicao]}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="text-[10px]"
                  style={{
                    backgroundColor: `${STATUS_COLORS[athlete.status]}20`,
                    color: STATUS_COLORS[athlete.status],
                  }}
                >
                  {STATUS_LABELS[athlete.status]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  #{athlete.numeroCamisa}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum atleta encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}

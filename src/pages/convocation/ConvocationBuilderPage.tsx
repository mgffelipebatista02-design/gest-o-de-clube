import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft,
  Trophy,
  Clock,
  MapPin,
  Calendar,
  Shield,
  Users,
  UserCog,
  Printer,
  Share2,
  Save,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { useCalendarStore } from '@/store/calendarStore'
import { useConvocationStore } from '@/store/convocationStore'
import { useAuthStore } from '@/store/authStore'
import { mockAthletes } from '@/data/mockAthletes'
import { mockUsers } from '@/data/mockUsers'
import { mockClub } from '@/data/mockClub'
import {
  POSITION_LABELS,
  STATUS_COLORS,
  ROLE_LABELS,
  type Convocation,
} from '@/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const STATUS_LABELS: Record<string, string> = {
  ativo: 'Apto',
  lesionado: 'Lesionado',
  emprestado: 'Emprestado',
  desligado: 'Desligado',
  suspenso: 'Suspenso',
}

export function ConvocationBuilderPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const event = useCalendarStore((s) => s.events.find((e) => e.id === eventId))
  const existing = useConvocationStore((s) =>
    eventId ? s.convocations.find((c) => c.eventoId === eventId) : undefined
  )
  const addConvocation = useConvocationStore((s) => s.addConvocation)
  const updateConvocation = useConvocationStore((s) => s.updateConvocation)

  const [selectedAthletes, setSelectedAthletes] = useState<string[]>(
    existing?.atletasConvocados ?? []
  )
  const [selectedStaff, setSelectedStaff] = useState<string[]>(
    existing?.comissaoConvocada ?? []
  )
  const [observacoes, setObservacoes] = useState(existing?.observacoes ?? '')
  const [saved, setSaved] = useState(false)

  // Comissao tecnica = todos os usuarios que nao sao atletas
  const staffMembers = useMemo(() => mockUsers, [])

  const athletesById = useMemo(
    () => new Map(mockAthletes.map((a) => [a.id, a])),
    []
  )
  const staffById = useMemo(
    () => new Map(staffMembers.map((s) => [s.id, s])),
    [staffMembers]
  )

  if (!event) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Evento nao encontrado" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-muted-foreground">
            O jogo solicitado nao foi encontrado.
          </p>
          <Button variant="outline" onClick={() => navigate('/calendario')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar ao Calendario
          </Button>
        </div>
      </div>
    )
  }

  function toggleAthlete(id: string) {
    setSaved(false)
    setSelectedAthletes((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  function toggleStaff(id: string) {
    setSaved(false)
    setSelectedStaff((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function selectFitAthletes() {
    setSaved(false)
    setSelectedAthletes(
      mockAthletes.filter((a) => a.status === 'ativo').map((a) => a.id)
    )
  }

  function clearAthletes() {
    setSaved(false)
    setSelectedAthletes([])
  }

  function handleSave() {
    if (!eventId) return
    if (existing) {
      updateConvocation(existing.id, {
        atletasConvocados: selectedAthletes,
        comissaoConvocada: selectedStaff,
        observacoes,
        data: new Date().toISOString(),
      })
    } else {
      const convocation: Convocation = {
        id: `conv-${Date.now()}`,
        eventoId: eventId,
        criadoPor: user?.id ?? '',
        criadoPorNome: user?.nome ?? '',
        data: new Date().toISOString(),
        atletasConvocados: selectedAthletes,
        comissaoConvocada: selectedStaff,
        observacoes,
        confirmacoes: [],
      }
      addConvocation(convocation)
    }
    setSaved(true)
  }

  function buildShareText() {
    const lines: string[] = []
    lines.push(`CONVOCACAO - ${mockClub.nomeFantasia}`)
    lines.push(event!.titulo)
    if (event!.adversario) lines.push(`Adversario: ${event!.adversario}`)
    if (event!.competicao) lines.push(`Competicao: ${event!.competicao}`)
    lines.push(
      `Data: ${format(parseISO(event!.dataInicio), "dd/MM/yyyy 'as' HH:mm", {
        locale: ptBR,
      })}`
    )
    if (event!.local && event!.local !== '-') lines.push(`Local: ${event!.local}`)
    lines.push('')
    lines.push(`ATLETAS CONVOCADOS (${selectedAthletes.length}):`)
    selectedAthletes.forEach((id) => {
      const a = athletesById.get(id)
      if (a) lines.push(`- #${a.numeroCamisa} ${a.nome} (${POSITION_LABELS[a.posicao]})`)
    })
    if (selectedStaff.length > 0) {
      lines.push('')
      lines.push(`COMISSAO TECNICA (${selectedStaff.length}):`)
      selectedStaff.forEach((id) => {
        const s = staffById.get(id)
        if (s) lines.push(`- ${s.nome} (${s.cargo})`)
      })
    }
    if (observacoes.trim()) {
      lines.push('')
      lines.push(`Observacoes: ${observacoes.trim()}`)
    }
    return lines.join('\n')
  }

  async function handleShare() {
    const text = buildShareText()
    try {
      if (navigator.share) {
        await navigator.share({ title: `Convocacao - ${event!.titulo}`, text })
      } else {
        await navigator.clipboard.writeText(text)
        alert('Convocacao copiada para a area de transferencia!')
      }
    } catch {
      // usuario cancelou o compartilhamento — sem acao
    }
  }

  function handlePrint() {
    window.print()
  }

  const selectedAthleteList = selectedAthletes
    .map((id) => athletesById.get(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .sort((a, b) => a.numeroCamisa - b.numeroCamisa)

  const selectedStaffList = selectedStaff
    .map((id) => staffById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  const startDate = parseISO(event.dataInicio)

  return (
    <div className="flex flex-col h-full">
      <div className="no-print">
        <TopBar title="Convocacao" subtitle={event.titulo} />
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        {/* Acoes / cabecalho (oculto na impressao) */}
        <div className="no-print space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1" />
                Enviar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={selectedAthletes.length === 0}
              >
                <Printer className="w-4 h-4 mr-1" />
                Imprimir / PDF
              </Button>
              <Button size="sm" onClick={handleSave} disabled={selectedAthletes.length === 0}>
                {saved ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                {saved ? 'Salvo' : 'Salvar'}
              </Button>
            </div>
          </div>

          {/* Resumo do jogo */}
          <Card className="p-5 space-y-4 border-l-4" style={{ borderLeftColor: '#991B1B' }}>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" style={{ color: '#991B1B' }} />
              <h2 className="text-lg font-bold">{event.titulo}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>
                  {format(startDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{format(startDate, "HH:mm")}</span>
              </div>
              {event.local && event.local !== '-' && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{event.local}</span>
                </div>
              )}
              {event.adversario && (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>vs {event.adversario}</span>
                </div>
              )}
            </div>
            {event.competicao && (
              <Badge variant="secondary">{event.competicao}</Badge>
            )}
          </Card>

          {/* Selecao de atletas */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Atletas</h3>
                <Badge variant="secondary">{selectedAthletes.length} convocados</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="xs" onClick={selectFitAthletes}>
                  Selecionar aptos
                </Button>
                <Button variant="ghost" size="xs" onClick={clearAthletes}>
                  Limpar
                </Button>
              </div>
            </div>
            <Separator />
            <div className="grid gap-2 sm:grid-cols-2">
              {mockAthletes.map((a) => {
                const checked = selectedAthletes.includes(a.id)
                const unavailable = a.status !== 'ativo'
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAthlete(a.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors ${
                      checked
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                        checked ? 'bg-primary border-primary' : 'border-input'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5 text-white" />}
                    </span>
                    <img
                      src={a.foto}
                      alt={a.nome}
                      className="w-9 h-9 rounded-full shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        #{a.numeroCamisa} {a.nome}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {POSITION_LABELS[a.posicao]}
                      </p>
                    </div>
                    {unavailable && (
                      <span
                        className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: `${STATUS_COLORS[a.status]}20`,
                          color: STATUS_COLORS[a.status],
                        }}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {STATUS_LABELS[a.status]}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Selecao de comissao tecnica */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold">Comissao Tecnica</h3>
              <Badge variant="secondary">{selectedStaff.length} selecionados</Badge>
            </div>
            <Separator />
            <div className="grid gap-2 sm:grid-cols-2">
              {staffMembers.map((s) => {
                const checked = selectedStaff.includes(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleStaff(s.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors ${
                      checked
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                        checked ? 'bg-primary border-primary' : 'border-input'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5 text-white" />}
                    </span>
                    <img
                      src={s.foto}
                      alt={s.nome}
                      className="w-9 h-9 rounded-full shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{s.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {s.cargo} | {ROLE_LABELS[s.role]}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Observacoes */}
          <Card className="p-5 space-y-2">
            <Label>Observacoes</Label>
            <Textarea
              value={observacoes}
              onChange={(e) => {
                setSaved(false)
                setObservacoes(e.target.value)
              }}
              placeholder="Instrucoes, horario de concentracao, uniforme, transporte..."
            />
          </Card>
        </div>

        {/* ===== Documento para impressao ===== */}
        <div className="print-area hidden print:block text-black">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold">{mockClub.nomeOficial}</h1>
              <p className="text-sm">Convocacao Oficial</p>
            </div>
            <Trophy className="w-10 h-10" />
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold">{event.titulo}</h2>
            <div className="text-sm mt-1 space-y-0.5">
              {event.adversario && <p>Adversario: {event.adversario}</p>}
              {event.competicao && <p>Competicao: {event.competicao}</p>}
              <p>
                Data:{' '}
                {format(startDate, "dd/MM/yyyy 'as' HH:mm", { locale: ptBR })}
              </p>
              {event.local && event.local !== '-' && <p>Local: {event.local}</p>}
            </div>
          </div>

          <h3 className="font-bold border-b border-black mb-2">
            Atletas Convocados ({selectedAthleteList.length})
          </h3>
          <table className="w-full text-sm mb-4 border-collapse">
            <thead>
              <tr className="border-b border-gray-400 text-left">
                <th className="py-1 pr-2 w-12">#</th>
                <th className="py-1 pr-2">Nome</th>
                <th className="py-1 pr-2">Posicao</th>
              </tr>
            </thead>
            <tbody>
              {selectedAthleteList.map((a) => (
                <tr key={a.id} className="border-b border-gray-200">
                  <td className="py-1 pr-2">{a.numeroCamisa}</td>
                  <td className="py-1 pr-2">{a.nome}</td>
                  <td className="py-1 pr-2">{POSITION_LABELS[a.posicao]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedStaffList.length > 0 && (
            <>
              <h3 className="font-bold border-b border-black mb-2">
                Comissao Tecnica ({selectedStaffList.length})
              </h3>
              <table className="w-full text-sm mb-4 border-collapse">
                <tbody>
                  {selectedStaffList.map((s) => (
                    <tr key={s.id} className="border-b border-gray-200">
                      <td className="py-1 pr-2">{s.nome}</td>
                      <td className="py-1 pr-2">{s.cargo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {observacoes.trim() && (
            <div className="mb-4">
              <h3 className="font-bold border-b border-black mb-2">Observacoes</h3>
              <p className="text-sm whitespace-pre-wrap">{observacoes}</p>
            </div>
          )}

          <div className="mt-10 pt-2 border-t border-black w-64 text-sm">
            {user?.nome ?? 'Comissao Tecnica'}
            <br />
            {user?.cargo ?? 'Treinador'}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isToday,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Clock,
  Filter,
  User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { useCalendarStore } from '@/store/calendarStore'
import { useAuthStore } from '@/store/authStore'
import { usePermissions } from '@/hooks/usePermissions'
import type { EventType, ClubEvent } from '@/types'
import { EVENT_COLORS, EVENT_LABELS } from '@/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const EVENT_TYPES: EventType[] = [
  'jogo',
  'treino',
  'academia',
  'alimentacao',
  'folga',
  'pagamento',
  'fisioterapia',
  'reuniao',
]

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

export default function CalendarPage() {
  const navigate = useNavigate()
  const events = useCalendarStore((s) => s.events)
  const addEvent = useCalendarStore((s) => s.addEvent)
  const user = useAuthStore((s) => s.user)
  const { canCreateEvents } = usePermissions()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [activeFilters, setActiveFilters] = useState<EventType[]>([...EVENT_TYPES])
  const [showFilters, setShowFilters] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // New event form state
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<EventType>('treino')
  const [newStartDate, setNewStartDate] = useState('')
  const [newEndDate, setNewEndDate] = useState('')
  const [newLocal, setNewLocal] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPublic, setNewPublic] = useState(true)

  const filteredEvents = useMemo(
    () => events.filter((e) => activeFilters.includes(e.tipo)),
    [events, activeFilters]
  )

  function getEventsForDay(day: Date): ClubEvent[] {
    return filteredEvents.filter((e) => isSameDay(parseISO(e.dataInicio), day))
  }

  function toggleFilter(type: EventType) {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  function resetForm() {
    setNewTitle('')
    setNewType('treino')
    setNewStartDate('')
    setNewEndDate('')
    setNewLocal('')
    setNewDescription('')
    setNewPublic(true)
  }

  function handleCreateEvent() {
    if (!newTitle || !newStartDate || !newEndDate) return
    const event: ClubEvent = {
      id: `e-${Date.now()}`,
      titulo: newTitle,
      tipo: newType,
      dataInicio: newStartDate,
      dataFim: newEndDate,
      local: newLocal,
      descricao: newDescription,
      publico: newPublic,
      recorrente: false,
      criadoPor: user?.id ?? '',
      criadoPorNome: user?.nome ?? '',
    }
    addEvent(event)
    resetForm()
    setDialogOpen(false)
  }

  // Monthly view data
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { locale: ptBR })
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR })
  const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Weekly view data
  const weekStart = startOfWeek(currentDate, { locale: ptBR })
  const weekEnd = endOfWeek(currentDate, { locale: ptBR })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : []

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Calendario" />

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
        {/* Action bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {canCreateEvents && <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Novo Evento
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Evento</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Titulo</Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Nome do evento"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={newType} onValueChange={(val) => setNewType(val as EventType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          <span className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: EVENT_COLORS[t] }}
                            />
                            {EVENT_LABELS[t]}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Inicio</Label>
                    <Input
                      type="datetime-local"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fim</Label>
                    <Input
                      type="datetime-local"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Local</Label>
                  <Input
                    value={newLocal}
                    onChange={(e) => setNewLocal(e.target.value)}
                    placeholder="Local do evento"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descricao</Label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Descricao do evento"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="publico"
                    checked={newPublic}
                    onChange={(e) => setNewPublic(e.target.checked)}
                    className="rounded border-input"
                  />
                  <Label htmlFor="publico">Evento publico</Label>
                </div>
              </div>

              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancelar
                </DialogClose>
                <Button onClick={handleCreateEvent} disabled={!newTitle || !newStartDate || !newEndDate}>
                  Criar Evento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filtros
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-3">
            <p className="text-sm font-medium mb-2">Filtrar por tipo:</p>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleFilter(t)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    activeFilters.includes(t)
                      ? 'border-transparent text-white'
                      : 'border-border text-muted-foreground bg-muted'
                  }`}
                  style={
                    activeFilters.includes(t)
                      ? { backgroundColor: EVENT_COLORS[t] }
                      : undefined
                  }
                >
                  {EVENT_LABELS[t]}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Calendar views */}
        <Tabs defaultValue="mensal">
          <TabsList>
            <TabsTrigger value="mensal">Mensal</TabsTrigger>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
          </TabsList>

          {/* Monthly view */}
          <TabsContent value="mensal">
            <div className="space-y-4">
              {/* Month navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold capitalize">
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </h3>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-px">
                {WEEKDAY_LABELS.map((label) => (
                  <div
                    key={label}
                    className="text-center text-xs font-medium text-muted-foreground py-2"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                {monthDays.map((day) => {
                  const dayEvents = getEventsForDay(day)
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isTodayDate = isToday(day)
                  const isSelected = selectedDay ? isSameDay(day, selectedDay) : false

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => setSelectedDay(day)}
                      className={`group relative min-h-[72px] md:min-h-[90px] p-1.5 text-left bg-background transition-colors hover:bg-muted/50 cursor-pointer ${
                        !isCurrentMonth ? 'opacity-40' : ''
                      } ${isSelected ? 'bg-muted' : ''}`}
                    >
                      {/* Botao + no hover (so para quem pode criar eventos) */}
                      {canCreateEvents && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const dateStr = format(day, "yyyy-MM-dd'T'09:00")
                            const dateEndStr = format(day, "yyyy-MM-dd'T'11:00")
                            setNewStartDate(dateStr)
                            setNewEndDate(dateEndStr)
                            setDialogOpen(true)
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/80 z-10"
                          title="Adicionar evento"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}

                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full ${
                          isTodayDate
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                            : ''
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-1">
                          {dayEvents.slice(0, 3).map((ev) => (
                            <span
                              key={ev.id}
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: EVENT_COLORS[ev.tipo] }}
                              title={ev.titulo}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-[10px] text-muted-foreground leading-none">
                              +{dayEvents.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Selected day events panel */}
              {selectedDay && (
                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}
                    </h4>
                    <Badge variant="secondary">{selectedDayEvents.length} evento(s)</Badge>
                  </div>
                  <Separator />
                  {selectedDayEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Nenhum evento neste dia.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDayEvents.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => navigate(`/calendario/evento/${ev.id}`)}
                          className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: EVENT_COLORS[ev.tipo] }}
                            />
                            <span className="font-medium text-sm">{ev.titulo}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(parseISO(ev.dataInicio), 'HH:mm')} -{' '}
                              {format(parseISO(ev.dataFim), 'HH:mm')}
                            </span>
                            {ev.local && ev.local !== '-' && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {ev.local}
                              </span>
                            )}
                          </div>
                          {ev.criadoPorNome && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Criado por {ev.criadoPorNome}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Weekly view */}
          <TabsContent value="semanal">
            <div className="space-y-4">
              {/* Week navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-sm font-semibold">
                  {format(weekStart, "dd MMM", { locale: ptBR })} -{' '}
                  {format(weekEnd, "dd MMM yyyy", { locale: ptBR })}
                </h3>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Weekly grid */}
              <div className="space-y-2">
                {weekDays.map((day) => {
                  const dayEvents = getEventsForDay(day)
                  const isTodayDate = isToday(day)

                  return (
                    <div
                      key={day.toISOString()}
                      className={`rounded-lg border p-3 ${
                        isTodayDate ? 'ring-2 ring-primary/30 border-primary/40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full ${
                            isTodayDate
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {format(day, 'd')}
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {format(day, 'EEEE', { locale: ptBR })}
                        </span>
                      </div>

                      {dayEvents.length === 0 ? (
                        <p className="text-xs text-muted-foreground pl-10">
                          Sem eventos
                        </p>
                      ) : (
                        <div className="space-y-1.5 pl-10">
                          {dayEvents.map((ev) => (
                            <button
                              key={ev.id}
                              onClick={() => navigate(`/calendario/evento/${ev.id}`)}
                              className="w-full text-left flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-muted/70"
                              style={{
                                borderLeft: `3px solid ${EVENT_COLORS[ev.tipo]}`,
                              }}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{ev.titulo}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(parseISO(ev.dataInicio), 'HH:mm')} -{' '}
                                  {format(parseISO(ev.dataFim), 'HH:mm')}
                                  {ev.local && ev.local !== '-' ? ` | ${ev.local}` : ''}
                                </p>
                                {ev.criadoPorNome && (
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <User className="w-2.5 h-2.5" />
                                    por {ev.criadoPorNome}
                                  </p>
                                )}
                              </div>
                              <Badge
                                variant="secondary"
                                className="text-[10px] shrink-0"
                                style={{
                                  backgroundColor: `${EVENT_COLORS[ev.tipo]}20`,
                                  color: EVENT_COLORS[ev.tipo],
                                }}
                              >
                                {EVENT_LABELS[ev.tipo]}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

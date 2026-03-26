import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockAthletes } from '@/data/mockAthletes'
import { mockEvents } from '@/data/mockEvents'
import { POSITION_LABELS } from '@/types'
import type { Formation, Athlete } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Users, GripVertical, RotateCcw, Save, ChevronDown,
} from 'lucide-react'

const FORMATIONS: { value: Formation; label: string; positions: { x: number; y: number; role: string }[] }[] = [
  {
    value: '4-3-3',
    label: '4-3-3',
    positions: [
      { x: 50, y: 90, role: 'GOL' },
      { x: 15, y: 70, role: 'LE' }, { x: 37, y: 75, role: 'ZAG' }, { x: 63, y: 75, role: 'ZAG' }, { x: 85, y: 70, role: 'LD' },
      { x: 25, y: 50, role: 'VOL' }, { x: 50, y: 45, role: 'MEI' }, { x: 75, y: 50, role: 'VOL' },
      { x: 20, y: 25, role: 'PE' }, { x: 50, y: 20, role: 'CA' }, { x: 80, y: 25, role: 'PD' },
    ],
  },
  {
    value: '4-4-2',
    label: '4-4-2',
    positions: [
      { x: 50, y: 90, role: 'GOL' },
      { x: 15, y: 70, role: 'LE' }, { x: 37, y: 75, role: 'ZAG' }, { x: 63, y: 75, role: 'ZAG' }, { x: 85, y: 70, role: 'LD' },
      { x: 15, y: 48, role: 'ME' }, { x: 38, y: 50, role: 'VOL' }, { x: 62, y: 50, role: 'VOL' }, { x: 85, y: 48, role: 'MD' },
      { x: 35, y: 22, role: 'ATA' }, { x: 65, y: 22, role: 'ATA' },
    ],
  },
  {
    value: '4-2-3-1',
    label: '4-2-3-1',
    positions: [
      { x: 50, y: 90, role: 'GOL' },
      { x: 15, y: 70, role: 'LE' }, { x: 37, y: 75, role: 'ZAG' }, { x: 63, y: 75, role: 'ZAG' }, { x: 85, y: 70, role: 'LD' },
      { x: 35, y: 55, role: 'VOL' }, { x: 65, y: 55, role: 'VOL' },
      { x: 20, y: 35, role: 'PE' }, { x: 50, y: 32, role: 'MEI' }, { x: 80, y: 35, role: 'PD' },
      { x: 50, y: 15, role: 'CA' },
    ],
  },
  {
    value: '3-5-2',
    label: '3-5-2',
    positions: [
      { x: 50, y: 90, role: 'GOL' },
      { x: 25, y: 75, role: 'ZAG' }, { x: 50, y: 78, role: 'ZAG' }, { x: 75, y: 75, role: 'ZAG' },
      { x: 10, y: 50, role: 'ALE' }, { x: 32, y: 52, role: 'VOL' }, { x: 50, y: 45, role: 'MEI' }, { x: 68, y: 52, role: 'VOL' }, { x: 90, y: 50, role: 'ALD' },
      { x: 35, y: 22, role: 'ATA' }, { x: 65, y: 22, role: 'ATA' },
    ],
  },
]

export function LineupPage() {
  const [selectedFormation, setSelectedFormation] = useState<Formation>('4-3-3')
  const [showFormationPicker, setShowFormationPicker] = useState(false)
  const [titulares, setTitulares] = useState<(Athlete | null)[]>(new Array(11).fill(null))
  const [reservas, setReservas] = useState<Athlete[]>([])
  const [draggedAthlete, setDraggedAthlete] = useState<Athlete | null>(null)

  const formation = FORMATIONS.find((f) => f.value === selectedFormation)!
  const availableAthletes = mockAthletes.filter(
    (a) => a.status === 'ativo' &&
    !titulares.some((t) => t?.id === a.id) &&
    !reservas.some((r) => r.id === a.id)
  )

  const nextGame = mockEvents
    .filter((e) => e.tipo === 'jogo' && new Date(e.dataInicio) > new Date())
    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())[0]

  const handleDropOnPosition = (index: number) => {
    if (draggedAthlete) {
      const newTitulares = [...titulares]
      // Remove from previous position if exists
      const prevIndex = newTitulares.findIndex((t) => t?.id === draggedAthlete.id)
      if (prevIndex >= 0) newTitulares[prevIndex] = null
      // Remove from reserves
      setReservas((r) => r.filter((a) => a.id !== draggedAthlete.id))
      newTitulares[index] = draggedAthlete
      setTitulares(newTitulares)
      setDraggedAthlete(null)
    }
  }

  const handleDropOnReserves = () => {
    if (draggedAthlete && !reservas.some((r) => r.id === draggedAthlete.id)) {
      // Remove from titulares
      setTitulares((t) => t.map((a) => a?.id === draggedAthlete.id ? null : a))
      setReservas((r) => [...r, draggedAthlete])
      setDraggedAthlete(null)
    }
  }

  const resetLineup = () => {
    setTitulares(new Array(11).fill(null))
    setReservas([])
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Escalacao" subtitle="Monte o time para o proximo jogo" />
      <div className="p-4 md:p-6 space-y-6">
        {/* Match Info */}
        {nextGame && (
          <div className="flex items-center justify-between bg-primary/5 p-4 rounded-lg">
            <div>
              <p className="font-bold">Clube Pro vs {nextGame.adversario}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(nextGame.dataInicio), "dd/MM/yyyy 'as' HH:mm", { locale: ptBR })} - {nextGame.local}
              </p>
            </div>
            <Badge>{nextGame.competicao}</Badge>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tactical Board */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Quadro Tatico</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFormationPicker(!showFormationPicker)}
                      >
                        {selectedFormation}
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                      {showFormationPicker && (
                        <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                          {FORMATIONS.map((f) => (
                            <button
                              key={f.value}
                              className="block w-full text-left px-4 py-2 hover:bg-muted text-sm"
                              onClick={() => {
                                setSelectedFormation(f.value)
                                setShowFormationPicker(false)
                              }}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={resetLineup}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-primary">
                      <Save className="w-4 h-4 mr-1" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Football Field */}
                <div
                  className="relative w-full bg-green-600 rounded-xl overflow-hidden"
                  style={{ paddingBottom: '140%' }}
                >
                  {/* Field Lines */}
                  <div className="absolute inset-0">
                    {/* Outer border */}
                    <div className="absolute inset-2 border-2 border-white/40 rounded-lg" />
                    {/* Center line */}
                    <div className="absolute left-2 right-2 top-1/2 h-0.5 bg-white/40" />
                    {/* Center circle */}
                    <div className="absolute left-1/2 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 border-2 border-white/40 rounded-full" />
                    {/* Top penalty area */}
                    <div className="absolute left-1/2 top-2 -translate-x-1/2 w-2/5 h-[15%] border-2 border-white/40 border-t-0" />
                    {/* Bottom penalty area */}
                    <div className="absolute left-1/2 bottom-2 -translate-x-1/2 w-2/5 h-[15%] border-2 border-white/40 border-b-0" />
                    {/* Top goal area */}
                    <div className="absolute left-1/2 top-2 -translate-x-1/2 w-1/5 h-[7%] border-2 border-white/40 border-t-0" />
                    {/* Bottom goal area */}
                    <div className="absolute left-1/2 bottom-2 -translate-x-1/2 w-1/5 h-[7%] border-2 border-white/40 border-b-0" />
                  </div>

                  {/* Positions */}
                  {formation.positions.map((pos, index) => (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDropOnPosition(index)}
                    >
                      {titulares[index] ? (
                        <div
                          className="flex flex-col items-center"
                          draggable
                          onDragStart={() => setDraggedAthlete(titulares[index])}
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-sm font-bold text-primary border-2 border-white">
                            {titulares[index]!.numeroCamisa}
                          </div>
                          <span className="text-[10px] md:text-xs text-white font-medium mt-0.5 bg-black/40 px-1.5 rounded">
                            {titulares[index]!.nome.split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-dashed border-white/60 flex items-center justify-center">
                            <span className="text-xs text-white/60">{pos.role}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reserves */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Banco de Reservas</CardTitle>
              </CardHeader>
              <CardContent
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropOnReserves}
              >
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  {reservas.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg cursor-grab"
                      draggable
                      onDragStart={() => setDraggedAthlete(a)}
                    >
                      <GripVertical className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm font-bold text-primary">{a.numeroCamisa}</span>
                      <span className="text-sm">{a.nome.split(' ')[0]}</span>
                    </div>
                  ))}
                  {reservas.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2">
                      Arraste jogadores para ca para o banco de reservas
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Athletes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <CardTitle className="text-base">Elenco Disponivel</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Arraste jogadores para o campo
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {availableAthletes.map((athlete) => (
                  <div
                    key={athlete.id}
                    className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 cursor-grab transition-colors"
                    draggable
                    onDragStart={() => setDraggedAthlete(athlete)}
                  >
                    <img src={athlete.foto} alt={athlete.nome} className="w-8 h-8 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{athlete.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {POSITION_LABELS[athlete.posicao]}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">#{athlete.numeroCamisa}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

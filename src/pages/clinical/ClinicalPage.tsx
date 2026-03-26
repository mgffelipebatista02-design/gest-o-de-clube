import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { mockInjuries } from '@/data/mockInjuries'
import { mockAthletes } from '@/data/mockAthletes'
import type { Injury } from '@/types'
import { format, differenceInDays } from 'date-fns'
import {
  HeartPulse, Plus, User, Calendar, AlertTriangle, CheckCircle2, Clock,
} from 'lucide-react'

const STATUS_CONFIG = {
  'em-tratamento': { label: 'Em Tratamento', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  'em-transicao': { label: 'Em Transicao', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'liberado': { label: 'Liberado', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
}

const SEVERITY_CONFIG = {
  leve: 'bg-yellow-100 text-yellow-800',
  moderada: 'bg-orange-100 text-orange-800',
  grave: 'bg-red-100 text-red-800',
}

export function ClinicalPage() {
  const [filter, setFilter] = useState<'all' | 'em-tratamento' | 'em-transicao' | 'liberado'>('all')
  const [selectedInjury, setSelectedInjury] = useState<Injury | null>(null)

  const filteredInjuries = filter === 'all'
    ? mockInjuries
    : mockInjuries.filter((i) => i.status === filter)

  const getAthlete = (id: string) => mockAthletes.find((a) => a.id === id)

  return (
    <div className="flex flex-col">
      <TopBar title="Modulo Clinico" subtitle="Gestao de lesoes e tratamentos" />
      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {(['em-tratamento', 'em-transicao', 'liberado'] as const).map((status) => {
            const config = STATUS_CONFIG[status]
            const StatusIcon = config.icon
            const count = mockInjuries.filter((i) => i.status === status).length
            return (
              <Card
                key={status}
                className={`cursor-pointer transition-all ${filter === status ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setFilter(filter === status ? 'all' : status)}
              >
                <CardContent className="pt-4 text-center">
                  <StatusIcon className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {filter === 'all' ? 'Todas as Lesoes' : STATUS_CONFIG[filter].label}
            <span className="text-muted-foreground font-normal ml-2">({filteredInjuries.length})</span>
          </h3>
          <Dialog>
            <DialogTrigger>
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Lesao
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nova Lesao</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Atleta</Label>
                  <select className="w-full mt-1 p-2 border rounded-md text-sm">
                    <option value="">Selecionar atleta...</option>
                    {mockAthletes.map((a) => (
                      <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Lesao</Label>
                    <Input placeholder="Ex: Entorse, Estiramento..." className="mt-1" />
                  </div>
                  <div>
                    <Label>Regiao do Corpo</Label>
                    <Input placeholder="Ex: Joelho Esquerdo..." className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Gravidade</Label>
                  <div className="flex gap-2 mt-1">
                    {(['leve', 'moderada', 'grave'] as const).map((g) => (
                      <button
                        key={g}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${SEVERITY_CONFIG[g]}`}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Protocolo de Recuperacao</Label>
                  <Textarea placeholder="Descreva o protocolo..." className="mt-1" rows={3} />
                </div>
                <div>
                  <Label>Previsao de Retorno</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <Button className="w-full bg-primary">Registrar Lesao</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Injury List */}
        <div className="space-y-3">
          {filteredInjuries.map((injury) => {
            const athlete = getAthlete(injury.atletaId)
            const days = differenceInDays(new Date(), new Date(injury.dataRegistro))
            const statusConfig = STATUS_CONFIG[injury.status]

            return (
              <Card
                key={injury.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedInjury(selectedInjury?.id === injury.id ? null : injury)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <HeartPulse className="w-6 h-6 text-destructive" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{athlete?.nome ?? 'Desconhecido'}</p>
                          <Badge className={SEVERITY_CONFIG[injury.gravidade]}>{injury.gravidade}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {injury.tipo} - {injury.regiao}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{days} dias</p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedInjury?.id === injury.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Registro</p>
                            <p className="font-medium">{format(new Date(injury.dataRegistro), 'dd/MM/yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Registrado por</p>
                            <p className="font-medium">{injury.registradoPor}</p>
                          </div>
                        </div>
                        {injury.previsaoRetorno && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Previsao Retorno</p>
                              <p className="font-medium">{format(new Date(injury.previsaoRetorno), 'dd/MM/yyyy')}</p>
                            </div>
                          </div>
                        )}
                        {injury.dataLiberacao && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-muted-foreground">Liberacao</p>
                              <p className="font-medium">{format(new Date(injury.dataLiberacao), 'dd/MM/yyyy')}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Protocolo</h4>
                        <p className="text-sm text-muted-foreground">{injury.protocolo}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Atendimentos ({injury.atendimentos.length})</h4>
                        <div className="space-y-2">
                          {injury.atendimentos.map((at) => (
                            <div key={at.id} className="flex gap-3 text-sm p-2 rounded bg-muted/50">
                              <span className="text-muted-foreground shrink-0">
                                {format(new Date(at.data), 'dd/MM')}
                              </span>
                              <p>{at.descricao}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

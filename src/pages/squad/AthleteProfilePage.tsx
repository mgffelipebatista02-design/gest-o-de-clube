import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockAthletes } from '@/data/mockAthletes'
import { mockInjuries } from '@/data/mockInjuries'
import { POSITION_LABELS, STATUS_COLORS } from '@/types'
import { format, differenceInDays } from 'date-fns'
import {
  ArrowLeft, User, BarChart3, HeartPulse, Calendar, Ruler, Weight,
  Footprints, Trophy, Target, Activity, Clock,
} from 'lucide-react'

export function AthleteProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'info' | 'stats' | 'lesoes'>('info')

  const athlete = mockAthletes.find((a) => a.id === id)
  const injuries = mockInjuries.filter((i) => i.atletaId === id)

  if (!athlete) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">Atleta nao encontrado</p>
        <Button variant="link" onClick={() => navigate('/elenco')}>Voltar ao Elenco</Button>
      </div>
    )
  }

  const presencaPercent = athlete.totalTreinos > 0
    ? Math.round((athlete.presencaTreinos / athlete.totalTreinos) * 100)
    : 0

  const PE_LABELS = { destro: 'Destro', canhoto: 'Canhoto', ambidestro: 'Ambidestro' }

  return (
    <div className="flex flex-col">
      <TopBar title={athlete.nome} subtitle={POSITION_LABELS[athlete.posicao]} />
      <div className="p-4 md:p-6 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/elenco')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar ao Elenco
        </Button>

        {/* Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <img src={athlete.foto} alt={athlete.nome} className="w-24 h-24 rounded-full" />
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                  {athlete.numeroCamisa}
                </span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{athlete.nome}</h2>
                <p className="text-muted-foreground">
                  {POSITION_LABELS[athlete.posicao]}
                  {athlete.posicaoSecundaria && ` / ${POSITION_LABELS[athlete.posicaoSecundaria]}`}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  <Badge
                    style={{
                      backgroundColor: STATUS_COLORS[athlete.status] + '20',
                      color: STATUS_COLORS[athlete.status],
                    }}
                  >
                    {athlete.status}
                  </Badge>
                  <Badge variant="outline">{athlete.categoria}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{athlete.gols}</p>
                  <p className="text-xs text-muted-foreground">Gols</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-clube-info">{athlete.assistencias}</p>
                  <p className="text-xs text-muted-foreground">Assist</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{athlete.jogosDisputados}</p>
                  <p className="text-xs text-muted-foreground">Jogos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {([
            { key: 'info' as const, label: 'Informacoes', icon: User },
            { key: 'stats' as const, label: 'Estatisticas', icon: BarChart3 },
            { key: 'lesoes' as const, label: 'Lesoes', icon: HeartPulse },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === key ? 'bg-white shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Calendar, label: 'Nascimento', value: format(new Date(athlete.dataNascimento), 'dd/MM/yyyy') },
                  { icon: Ruler, label: 'Altura', value: `${athlete.altura} cm` },
                  { icon: Weight, label: 'Peso', value: `${athlete.peso} kg` },
                  { icon: Footprints, label: 'Pe Dominante', value: PE_LABELS[athlete.peDominante] },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground flex-1">{label}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contrato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">Ingresso</span>
                  <span className="text-sm font-medium">{format(new Date(athlete.dataIngresso), 'dd/MM/yyyy')}</span>
                </div>
                {athlete.contratoInicio && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground flex-1">Inicio Contrato</span>
                    <span className="text-sm font-medium">{format(new Date(athlete.contratoInicio), 'dd/MM/yyyy')}</span>
                  </div>
                )}
                {athlete.contratoFim && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground flex-1">Fim Contrato</span>
                    <span className="text-sm font-medium">{format(new Date(athlete.contratoFim), 'dd/MM/yyyy')}</span>
                  </div>
                )}
                {athlete.email && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground flex-1">Email</span>
                    <span className="text-sm font-medium">{athlete.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {tab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Trophy, label: 'Jogos Disputados', value: athlete.jogosDisputados, color: 'text-primary' },
                { icon: User, label: 'Como Titular', value: athlete.jogosTitular, color: 'text-clube-info' },
                { icon: Target, label: 'Gols', value: athlete.gols, color: 'text-clube-success' },
                { icon: Activity, label: 'Assistencias', value: athlete.assistencias, color: 'text-clube-warning' },
              ].map(({ icon: Icon, label, value, color }) => (
                <Card key={label}>
                  <CardContent className="pt-4 text-center">
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${color}`} />
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xl font-bold">{athlete.minutosJogados}</p>
                    <p className="text-xs text-muted-foreground">Minutos Jogados</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-yellow-50">
                    <p className="text-xl font-bold text-yellow-700">{athlete.cartoesAmarelos}</p>
                    <p className="text-xs text-muted-foreground">Cartoes Amarelos</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-50">
                    <p className="text-xl font-bold text-red-700">{athlete.cartoesVermelhos}</p>
                    <p className="text-xs text-muted-foreground">Cartoes Vermelhos</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-50">
                    <p className="text-xl font-bold text-green-700">{presencaPercent}%</p>
                    <p className="text-xs text-muted-foreground">Presenca Treinos</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-50">
                    <p className="text-xl font-bold text-blue-700">
                      {athlete.jogosDisputados > 0 ? Math.round(athlete.minutosJogados / athlete.jogosDisputados) : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Min/Jogo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {tab === 'lesoes' && (
          <div className="space-y-3">
            {injuries.length > 0 ? injuries.map((injury) => {
              const days = differenceInDays(new Date(), new Date(injury.dataRegistro))
              return (
                <Card key={injury.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{injury.tipo} - {injury.regiao}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Registrada em {format(new Date(injury.dataRegistro), 'dd/MM/yyyy')} ({days} dias)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={
                          injury.gravidade === 'grave' ? 'bg-red-100 text-red-800' :
                          injury.gravidade === 'moderada' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {injury.gravidade}
                        </Badge>
                        <Badge className={
                          injury.status === 'liberado' ? 'bg-green-100 text-green-800' :
                          injury.status === 'em-transicao' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {injury.status === 'em-tratamento' ? 'Em Tratamento' :
                           injury.status === 'em-transicao' ? 'Em Transicao' : 'Liberado'}
                        </Badge>
                      </div>
                    </div>
                    {injury.protocolo && (
                      <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/50 rounded-lg">
                        {injury.protocolo}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            }) : (
              <div className="text-center py-12">
                <HeartPulse className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">Nenhuma lesao registrada</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

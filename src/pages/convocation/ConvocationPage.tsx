import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockEvents } from '@/data/mockEvents'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, Clock, MapPin, Trophy, XCircle } from 'lucide-react'

export function ConvocationPage() {
  const [confirmations, setConfirmations] = useState<Record<string, 'confirmado' | 'ausencia'>>({})

  const upcomingGames = mockEvents
    .filter((e) => e.tipo === 'jogo' && new Date(e.dataInicio) > new Date())
    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())

  const handleConfirm = (eventId: string, status: 'confirmado' | 'ausencia') => {
    setConfirmations((prev) => ({ ...prev, [eventId]: status }))
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Convocacoes" subtitle="Suas convocacoes e confirmacoes" />
      <div className="p-4 md:p-6 space-y-4">
        {upcomingGames.length > 0 ? (
          upcomingGames.map((game) => {
            const status = confirmations[game.id]
            return (
              <Card key={game.id} className="border-l-4 border-l-clube-error">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-clube-error" />
                      <CardTitle className="text-lg">Clube Pro vs {game.adversario}</CardTitle>
                    </div>
                    {status && (
                      <Badge className={status === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {status === 'confirmado' ? 'Confirmado' : 'Ausencia'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {game.competicao && (
                    <Badge variant="secondary" className="mb-3">{game.competicao}</Badge>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(game.dataInicio), "EEEE, dd/MM 'as' HH:mm", { locale: ptBR })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {game.local}
                    </span>
                  </div>
                  {!status && (
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={() => handleConfirm(game.id, 'confirmado')}
                        className="bg-clube-success hover:bg-clube-success/90"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirmar Presenca
                      </Button>
                      <Button
                        variant="outline"
                        className="text-destructive border-destructive hover:bg-destructive/5"
                        onClick={() => handleConfirm(game.id, 'ausencia')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Informar Ausencia
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">Nenhuma convocacao pendente</p>
          </div>
        )}
      </div>
    </div>
  )
}

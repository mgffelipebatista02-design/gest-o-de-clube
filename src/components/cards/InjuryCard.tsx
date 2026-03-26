import { differenceInDays } from 'date-fns'
import { Activity, User } from 'lucide-react'
import { type Injury, type InjurySeverity, type InjuryStatus } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface InjuryCardProps {
  injury: Injury
  athleteName: string
}

const SEVERITY_CONFIG: Record<InjurySeverity, { label: string; color: string }> = {
  leve: { label: 'Leve', color: '#2E7D32' },
  moderada: { label: 'Moderada', color: '#F9A825' },
  grave: { label: 'Grave', color: '#C62828' },
}

const STATUS_LABELS: Record<InjuryStatus, string> = {
  'em-tratamento': 'Em tratamento',
  'em-transicao': 'Em transicao',
  liberado: 'Liberado',
}

export function InjuryCard({ injury, athleteName }: InjuryCardProps) {
  const severity = SEVERITY_CONFIG[injury.gravidade]
  const daysSince = differenceInDays(new Date(), new Date(injury.dataRegistro))

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <p className="font-medium leading-tight">{athleteName}</p>
          </div>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: severity.color }}
          >
            {severity.label}
          </span>
        </div>

        {/* Injury details */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Tipo</p>
            <p className="font-medium">{injury.tipo}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Regiao</p>
            <p className="font-medium">{injury.regiao}</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Activity className="size-3" />
            {STATUS_LABELS[injury.status]}
          </span>
          <span>
            {daysSince} {daysSince === 1 ? 'dia' : 'dias'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

import { type Athlete, POSITION_LABELS } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from './StatusBadge'

interface AthleteCardProps {
  athlete: Athlete
  onClick?: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function AthleteCard({ athlete, onClick }: AthleteCardProps) {
  return (
    <Card
      className={`shadow-sm transition-shadow ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4">
        <div className="relative">
          <Avatar size="lg">
            <AvatarImage src={athlete.foto} alt={athlete.nome} />
            <AvatarFallback>{getInitials(athlete.nome)}</AvatarFallback>
          </Avatar>
          {athlete.numeroCamisa > 0 && (
            <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {athlete.numeroCamisa}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium leading-tight">{athlete.nome}</p>
          <p className="text-xs text-muted-foreground">
            {POSITION_LABELS[athlete.posicao]}
          </p>
        </div>
        <StatusBadge status={athlete.status} />
      </CardContent>
    </Card>
  )
}

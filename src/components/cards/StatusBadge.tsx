import { type AthleteStatus, STATUS_COLORS } from '@/types'

const STATUS_LABELS: Record<AthleteStatus, string> = {
  ativo: 'Ativo',
  lesionado: 'Lesionado',
  emprestado: 'Emprestado',
  desligado: 'Desligado',
  suspenso: 'Suspenso',
}

interface StatusBadgeProps {
  status: AthleteStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_COLORS[status]
  const label = STATUS_LABELS[status]

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${color}18`,
        color: color,
      }}
    >
      <span
        className="mr-1.5 inline-block size-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}

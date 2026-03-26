import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  trend?: 'up' | 'down'
  trendValue?: string
  color?: string
}

export function StatCard({ label, value, icon: Icon, trend, trendValue, color }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              {trend === 'up' ? (
                <TrendingUp className="size-3.5 text-emerald-600" />
              ) : (
                <TrendingDown className="size-3.5 text-red-600" />
              )}
              <span
                className={`text-xs font-medium ${
                  trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div
          className="flex size-10 items-center justify-center rounded-lg"
          style={{
            backgroundColor: color ? `${color}18` : undefined,
            color: color ?? undefined,
          }}
        >
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}

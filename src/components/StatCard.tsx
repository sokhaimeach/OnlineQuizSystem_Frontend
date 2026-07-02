import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  colorClass?: string
  bgClass?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  colorClass = 'text-primary',
  bgClass = 'bg-primary/10',
}: StatCardProps) {
  const trendPositive = trend !== undefined && trend > 0
  const trendNegative = trend !== undefined && trend < 0

  return (
    <div className="bg-card rounded-md border border-border p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-lg', bgClass)}>
          <Icon className={cn('h-5 w-5', colorClass)} />
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-sm',
              trendPositive && 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950',
              trendNegative && 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950',
              !trendPositive && !trendNegative && 'text-muted-foreground bg-muted',
            )}
          >
            {trendPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : trendNegative ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        {trendLabel && (
          <p className="text-xs text-muted-foreground mt-1">{trendLabel}</p>
        )}
      </div>
    </div>
  )
}

import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    label: string
  }
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'default',
  className
}: StatCardProps) {
  const variantStyles = {
    default: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400', 
    danger: 'text-red-600 dark:text-red-400'
  }

  const trendStyles = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground'
  }

  const trendType = trend ? (trend.value > 0 ? 'positive' : trend.value < 0 ? 'negative' : 'neutral') : null

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p className={cn('text-xs font-medium', trendStyles[trendType!])}>
                {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
              </p>
            )}
          </div>
          {icon && (
            <div className={cn('h-8 w-8', variantStyles[variant])}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
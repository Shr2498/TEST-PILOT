import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  AlertCircle, 
  ArrowUp, 
  Minus, 
  ArrowDown,
  Flame
} from 'lucide-react'

type PriorityType = 'critical' | 'high' | 'medium' | 'low'

interface PriorityBadgeProps {
  priority: PriorityType
  showIcon?: boolean
  className?: string
}

const priorityConfig = {
  critical: { 
    label: 'Critical', 
    icon: Flame,
    className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
  },
  high: { 
    label: 'High', 
    icon: ArrowUp,
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800'
  },
  medium: { 
    label: 'Medium', 
    icon: Minus,
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
  },
  low: { 
    label: 'Low', 
    icon: ArrowDown,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
  }
}

export function PriorityBadge({ priority, showIcon = true, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.medium
  const Icon = config.icon

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center space-x-1 font-medium',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      <span>{config.label}</span>
    </Badge>
  )
}
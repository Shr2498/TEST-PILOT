import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Play, 
  Pause, 
  Square,
  AlertTriangle
} from 'lucide-react'

type StatusType = 'active' | 'inactive' | 'completed' | 'failed' | 'running' | 'paused' | 'cancelled' | 'blocked' | 'not_run' | 'passed' | 'archived' | 'on_hold'

interface StatusBadgeProps {
  status: StatusType
  showIcon?: boolean
  className?: string
}

const statusConfig = {
  // Project statuses
  active: { 
    label: 'Active', 
    variant: 'success' as const, 
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  },
  inactive: { 
    label: 'Inactive', 
    variant: 'secondary' as const, 
    icon: Clock,
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  },
  archived: { 
    label: 'Archived', 
    variant: 'secondary' as const, 
    icon: Square,
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  },
  on_hold: { 
    label: 'On Hold', 
    variant: 'warning' as const, 
    icon: Pause,
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  },

  // Test run statuses
  completed: { 
    label: 'Completed', 
    variant: 'success' as const, 
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  },
  running: { 
    label: 'Running', 
    variant: 'warning' as const, 
    icon: Play,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  },
  paused: { 
    label: 'Paused', 
    variant: 'secondary' as const, 
    icon: Pause,
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  },
  cancelled: { 
    label: 'Cancelled', 
    variant: 'secondary' as const, 
    icon: XCircle,
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  },
  failed: { 
    label: 'Failed', 
    variant: 'destructive' as const, 
    icon: XCircle,
    className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  },

  // Test case statuses
  passed: { 
    label: 'Passed', 
    variant: 'success' as const, 
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  },
  blocked: { 
    label: 'Blocked', 
    variant: 'warning' as const, 
    icon: AlertTriangle,
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  },
  not_run: { 
    label: 'Not Run', 
    variant: 'secondary' as const, 
    icon: Clock,
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.inactive
  const Icon = config.icon

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        'flex items-center space-x-1 font-medium border-0',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      <span>{config.label}</span>
    </Badge>
  )
}
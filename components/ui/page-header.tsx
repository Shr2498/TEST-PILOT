import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  backButton?: {
    href: string
    label: string
  }
  className?: string
}

export function PageHeader({
  title,
  description,
  icon,
  action,
  backButton,
  className
}: Readonly<PageHeaderProps>) {
  return (
    <div className={cn('space-y-4', className)}>
      {backButton && (
        <Button variant="ghost" size="sm" asChild>
          <Link href={backButton.href}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backButton.label}
          </Link>
        </Button>
      )}
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            {icon}
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          </div>
          {description && (
            <p className="text-muted-foreground text-lg">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  )
}
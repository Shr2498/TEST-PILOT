import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  FileX, 
  ServerCrash, 
  Wifi,
  ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ErrorType = 'generic' | 'network' | 'not-found' | 'unauthorized' | 'server' | 'validation'

interface ErrorStateProps {
  type?: ErrorType
  title?: string
  description?: string
  error?: string | Error
  showRetry?: boolean
  onRetry?: () => void
  showHome?: boolean
  actions?: ReactNode
  className?: string
}

const errorConfig = {
  generic: {
    icon: AlertTriangle,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.'
  },
  network: {
    icon: Wifi,
    title: 'Connection Error',
    description: 'Unable to connect to the server. Please check your internet connection.'
  },
  'not-found': {
    icon: FileX,
    title: 'Not Found',
    description: 'The requested resource could not be found.'
  },
  unauthorized: {
    icon: ShieldAlert,
    title: 'Access Denied',
    description: 'You do not have permission to access this resource.'
  },
  server: {
    icon: ServerCrash,
    title: 'Server Error',
    description: 'The server encountered an error. Please try again later.'
  },
  validation: {
    icon: AlertTriangle,
    title: 'Validation Error',
    description: 'Please check your input and try again.'
  }
}

export function ErrorState({
  type = 'generic',
  title,
  description,
  error,
  showRetry = true,
  onRetry,
  showHome = false,
  actions,
  className
}: ErrorStateProps) {
  const config = errorConfig[type]
  const Icon = config.icon
  
  const errorTitle = title || config.title
  const errorDescription = description || config.description
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-8">
        <div className="text-red-500 mb-6">
          <Icon className="h-12 w-12" />
        </div>
        
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-lg font-semibold">{errorTitle}</h3>
          <p className="text-muted-foreground max-w-md">{errorDescription}</p>
        </div>

        {errorMessage && (
          <Alert className="max-w-md mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-mono text-xs">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {(showRetry || showHome || actions) && (
          <div className="flex space-x-3">
            {showRetry && onRetry && (
              <Button onClick={onRetry} variant="default">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            
            {showHome && (
              <Button variant="outline" asChild>
                <a href="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </a>
              </Button>
            )}
            
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Specialized error components for common scenarios
export function NotFoundError({ resource = 'resource' }: { resource?: string }) {
  return (
    <ErrorState
      type="not-found"
      title={`${resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found`}
      description={`The ${resource} you're looking for doesn't exist or may have been deleted.`}
      showHome
    />
  )
}

export function UnauthorizedError() {
  return (
    <ErrorState
      type="unauthorized"
      actions={
        <Button variant="outline" asChild>
          <a href="/auth/signin">
            Sign In
          </a>
        </Button>
      }
    />
  )
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      type="network"
      showRetry
      onRetry={onRetry}
    />
  )
}
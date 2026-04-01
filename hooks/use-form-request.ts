import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SubmitHandler, UseFormReturn, FieldValues } from 'react-hook-form'

export interface UseFormRequestOptions {
  onSuccess?: (data?: any) => void
  onError?: (error: string) => void
  redirectTo?: string
}

export interface UseFormRequestReturn<T extends FieldValues> {
  handleSubmit: (form: UseFormReturn<T>) => SubmitHandler<T>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

/**
 * Custom hook to handle form submission with loading, error states, and common patterns
 * Reduces boilerplate across all forms in the app
 */
export function useFormRequest<T extends FieldValues>(
  submitAction: (data: T) => Promise<{ data?: any; error: string | null }>,
  options: UseFormRequestOptions = {}
): UseFormRequestReturn<T> {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { onSuccess, onError, redirectTo } = options

  const handleSubmit = (form: UseFormReturn<T>): SubmitHandler<T> => {
    return async (data: T) => {
      try {
        setIsLoading(true)
        setError(null)
        
        const result = await submitAction(data)
        
        if (result.error) {
          setError(result.error)
          onError?.(result.error)
        } else {
          // Success
          onSuccess?.(result.data)
          
          if (redirectTo) {
            router.push(redirectTo)
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(errorMessage)
        onError?.(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const clearError = () => setError(null)

  return {
    handleSubmit,
    isLoading,
    error,
    clearError
  }
}

/**
 * Simplified version for server actions that don't need complex options
 */
export function useServerAction<T extends FieldValues>(
  serverAction: (data: T) => Promise<{ data?: any; error: string | null }>,
  redirectPath?: string
) {
  return useFormRequest(serverAction, {
    redirectTo: redirectPath
  })
}
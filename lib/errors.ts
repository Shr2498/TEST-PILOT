/**
 * Centralized error handling for server actions
 * Reduces duplication and provides consistent error responses
 */

type ServerActionResult<T> = {
  data: T | null
  error: string | null
}

/**
 * Wraps server operations with consistent error handling
 * @param operation - Async operation to execute
 * @param errorContext - Context for error logging (e.g., 'fetching projects')
 * @returns Standardized result object
 */
export async function handleServerAction<T>(
  operation: () => Promise<T>,
  errorContext: string
): Promise<ServerActionResult<T>> {
  try {
    const data = await operation()
    return { data, error: null }
  } catch (error) {
    console.error(`Error ${errorContext}:`, error)
    
    // Extract meaningful error messages
    let errorMessage = `Failed to ${errorContext}`
    
    if (error instanceof Error) {
      // Handle known error types
      if (error.message.includes('Unique constraint')) {
        errorMessage = 'A record with this information already exists'
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Cannot complete operation due to related records'
      } else if (error.message.includes('Record to update not found')) {
        errorMessage = 'The item you are trying to update no longer exists'
      } else if (error.message.includes('Authentication')) {
        errorMessage = 'You are not authorized to perform this action'
      } else {
        // Include the actual error message for debugging in development
        errorMessage = process.env.NODE_ENV === 'development' 
          ? `Failed to ${errorContext}: ${error.message}`
          : `Failed to ${errorContext}`
      }
    }
    
    return { data: null, error: errorMessage }
  }
}

/**
 * Legacy wrapper for backward compatibility - use handleServerAction instead
 * @deprecated Use handleServerAction for better error handling
 */
export async function handleServerError<T>(
  operation: () => Promise<T>,
  context: string
): Promise<ServerActionResult<T>> {
  return handleServerAction(operation, context)
}

/**
 * Logs errors with consistent formatting
 */
export function logError(context: string, error: unknown) {
  console.error(`[${new Date().toISOString()}] Error in ${context}:`, error)
}
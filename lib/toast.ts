import { toast as baseToast } from '@/hooks/use-toast'

// Simple toast API similar to sonner
export const toast = {
  success: (message: string) => {
    baseToast({
      title: "Success",
      description: message,
      variant: "default",
    })
  },
  
  error: (message: string) => {
    baseToast({
      title: "Error", 
      description: message,
      variant: "destructive",
    })
  },
  
  // Base toast function for custom usage
  ...baseToast
}
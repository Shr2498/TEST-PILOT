'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'default' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export default function LogoutButton({ 
  variant = 'ghost', 
  size = 'sm',
  className 
}: LogoutButtonProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  )
}
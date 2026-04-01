'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Settings, LogOut, User as UserIcon } from 'lucide-react'
import { MobileSidebar } from './sidebar'
import LogoutButton from '@/components/auth/logout-button'
import { SimpleThemeToggle } from '@/components/theme-toggle'

interface HeaderProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    avatar?: string | null
    teamName?: string
  }
}

export function Header({ user }: HeaderProps) {
  const initials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left side - Mobile menu + Logo */}
        <div className="flex items-center space-x-4">
          <MobileSidebar>
            {/* Mobile sidebar content */}
          </MobileSidebar>
          
          {/* Desktop Logo */}
          <Link href="/dashboard" className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              TP
            </div>
            <span className="font-bold text-xl">TestPilot</span>
          </Link>
        </div>

        {/* Center - Workspace context (can be added later) */}
        <div className="flex-1 flex justify-center">
          {/* Workspace breadcrumbs or project selector can go here */}
        </div>

        {/* Right side - Theme toggle + User menu */}
        <div className="flex items-center space-x-2">
          <SimpleThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="w-full cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer p-0">
                <LogoutButton className="w-full justify-start p-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
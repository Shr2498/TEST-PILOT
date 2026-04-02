import { ReactNode } from 'react'
import { requireAuth } from '@/lib/auth-utils'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header user={user} />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-16 z-40">
          <div className="flex-1 flex flex-col min-h-0 border-r bg-background">
            <Sidebar />
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 md:pl-64">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
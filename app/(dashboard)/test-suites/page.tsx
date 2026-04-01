import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Layers } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyTestSuites } from '@/components/ui/empty-states'

export default function TestSuitesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Suites"
        description="Organize test cases into executable test suites"
        icon={<Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        action={
          <Button asChild>
            <Link href="/test-suites/new">
              <Plus className="h-4 w-4 mr-2" />
              New Test Suite
            </Link>
          </Button>
        }
      />
      
      <EmptyTestSuites />
    </div>
  )
}

export const metadata = {
  title: 'Test Suites | TestPilot',
  description: 'Manage your test suites',
}
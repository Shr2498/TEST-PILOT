import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, PlayCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyTestRuns } from '@/components/ui/empty-states'

export default function TestRunsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Runs"
        description="Execute test suites and track results"
        icon={<PlayCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        action={
          <Button asChild>
            <Link href="/test-runs/new">
              <Plus className="h-4 w-4 mr-2" />
              Run Tests
            </Link>
          </Button>
        }
      />
      
      <EmptyTestRuns />
    </div>
  )
}

export const metadata = {
  title: 'Test Runs | TestPilot',
  description: 'Execute and manage test runs',
}
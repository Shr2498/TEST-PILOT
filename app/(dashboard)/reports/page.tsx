// Force dynamic rendering due to authentication
export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  FileText, 
  FolderOpen, 
  Play, 
  Calendar, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { getReportsData } from '@/lib/actions/reports'
import { formatDistanceToNow, format } from 'date-fns'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { EmptyReports } from '@/components/ui/empty-states'
import { ErrorState } from '@/components/ui/error-state'
import { StatusBadge } from '@/components/ui/status-badge'





function RunStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status as any} />
}

export default async function ReportsPage() {
  const { data, error } = await getReportsData()

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Reports"
          description="Overview of test execution across all projects"
          icon={<BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        />
        <ErrorState 
          error={error}
          showRetry
        />
      </div>
    )
  }

  if (!data || data.totalTestRuns === 0) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Reports"
          description="Overview of test execution across all projects"
          icon={<BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        />
        <EmptyReports />
      </div> 
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Overview of test execution across all projects"
        icon={<BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
      />

      {/* Overall Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Test Runs"
          value={data.totalTestRuns}
          icon={<Play className="h-8 w-8" />}
          description="All time"
        />
        <StatCard
          title="Passed"
          value={data.totalPassed}
          icon={<CheckCircle className="h-8 w-8" />}
          variant="success"
        />
        <StatCard
          title="Failed"
          value={data.totalFailed}
          icon={<XCircle className="h-8 w-8" />}
          variant="danger"
        />
        <StatCard
          title="Blocked"
          value={data.totalBlocked}
          icon={<AlertCircle className="h-8 w-8" />}
          variant="warning"
        />
        <StatCard
          title="Pass Rate"
          value={`${data.overallPassRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-8 w-8" />}
          variant={data.overallPassRate >= 80 ? 'success' : data.overallPassRate >= 60 ? 'warning' : 'danger'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Test Runs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Runs</CardTitle>
            <CardDescription>
              Latest test executions across all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentRuns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Play className="h-8 w-8 mx-auto mb-2" />
                <p>No test runs yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{run.name}</p>
                        <RunStatusBadge status={run.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {run.project.name} • {run.testSuite.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(run.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex space-x-2 mb-1">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          {run.passedCount}P
                        </span>
                        {run.failedCount > 0 && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                            {run.failedCount}F
                          </span>
                        )}
                        {run.blockedCount > 0 && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                            {run.blockedCount}B
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium">
                        {run.passRate.toFixed(1)}% pass
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Summaries */}
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
            <CardDescription>
              Test activity by project
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.projectSummaries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-8 w-8 mx-auto mb-2" />
                <p>No projects yet</p>
                <Button asChild className="mt-4">
                  <Link href="/projects/new">
                    Create Project
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {data.projectSummaries.map((project) => (
                  <div key={project.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Link 
                        href={`/projects/${project.id}`}
                        className="font-medium hover:text-blue-600 transition-colors"
                      >
                        {project.name}
                      </Link>
                      {project.avgPassRate > 0 && (
                        <span className="text-sm font-medium">
                          {project.avgPassRate.toFixed(1)}% avg pass
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex space-x-4">
                        <span>{project.testCasesCount} test cases</span>
                        <span>{project.testSuitesCount} suites</span>
                        <span>{project.testRunsCount} runs</span>
                      </div>
                      {project.lastRunAt && (
                        <span>
                          Last run {formatDistanceToNow(new Date(project.lastRunAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Reports | TestPilot',
  description: 'Test execution reports and analytics',
}
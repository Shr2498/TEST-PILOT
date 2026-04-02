import { getCurrentUser } from '@/lib/auth-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  FolderOpen,
  FileText,
  Layers,
  PlayCircle,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Minus
} from 'lucide-react'
import { mockDashboardStats } from '@/__mocks__/dashboard'

function StatCard({ title, value, icon: Icon, description, trend }: Readonly<{
  title: string
  value: number
  icon: any
  description: string
  trend?: { value: number; positive: boolean }
}>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3 w-3 mr-1 ${trend.positive ? '' : 'rotate-180'}`} />
            {trend.positive ? '+' : ''}{trend.value}% from last week
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TestRunsTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'in-progress':
        return <Badge variant="info">In Progress</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'In progress'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Test Runs</CardTitle>
        <CardDescription>
          Latest test execution results across your projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDashboardStats.recentTestRuns.map((run) => (
            <div key={run.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                {getStatusIcon(run.status)}
                <div>
                  <div className="font-medium">{run.name}</div>
                  <div className="text-sm text-muted-foreground">{run.project}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3 text-sm">
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>{run.passed}</span>
                  </span>
                  {run.failed > 0 && (
                    <span className="flex items-center space-x-1">
                      <XCircle className="h-3 w-3 text-red-600" />
                      <span>{run.failed}</span>
                    </span>
                  )}
                  {run.blocked > 0 && (
                    <span className="flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                      <span>{run.blocked}</span>
                    </span>
                  )}
                  {run.notRun > 0 && (
                    <span className="flex items-center space-x-1">
                      <Minus className="h-3 w-3 text-gray-400" />
                      <span>{run.notRun}</span>
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground min-w-[120px]">
                  {formatDate(run.completedAt)}
                </div>
                
                <div className="text-sm font-medium min-w-[100px]">
                  {run.assignee}
                </div>
                
                {getStatusBadge(run.status)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" asChild className="w-full">
            <Link href="/test-runs">View All Test Runs</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PassFailSummary() {
  const { totalTests, passed, failed, blocked, notRun } = mockDashboardStats.overallStats
  const passRate = Math.round((passed / totalTests) * 100)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results Summary</CardTitle>
        <CardDescription>
          Overall test execution results across all projects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Pass Rate</span>
          <span className="text-2xl font-bold text-green-600">{passRate}%</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Tests</span>
            <span className="font-medium">{totalTests}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Passed</span>
            </span>
            <span className="font-medium text-green-600">{passed}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center space-x-2">
              <XCircle className="h-3 w-3 text-red-600" />
              <span>Failed</span>
            </span>
            <span className="font-medium text-red-600">{failed}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center space-x-2">
              <AlertCircle className="h-3 w-3 text-yellow-600" />
              <span>Blocked</span>
            </span>
            <span className="font-medium text-yellow-600">{blocked}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center space-x-2">
              <Minus className="h-3 w-3 text-gray-400" />
              <span>Not Run</span>
            </span>
            <span className="font-medium text-gray-600">{notRun}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{width: `${passRate}%`}}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActions() {
  const actions = [
    {
      title: "Create Project",
      description: "Start a new testing project",
      href: "/projects/new",
      icon: FolderOpen,
      buttonText: "New Project"
    },
    {
      title: "Create Test Case",
      description: "Add a new test case",
      href: "/test-cases/new", 
      icon: FileText,
      buttonText: "New Test Case"
    },
    {
      title: "Create Test Run",
      description: "Execute a test suite",
      href: "/test-runs/new",
      icon: PlayCircle,
      buttonText: "New Test Run"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks to get you started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <action.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href={action.href}>
                <Plus className="h-3 w-3 mr-1" />
                {action.buttonText}
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening with your tests.
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link href="/test-runs/new">
            <Plus className="h-4 w-4 mr-2" />
            Run Tests
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={mockDashboardStats.totalProjects}
          icon={FolderOpen}
          description="Active testing projects"
          trend={{ value: 25, positive: true }}
        />
        <StatCard
          title="Test Cases"
          value={mockDashboardStats.totalTestCases}
          icon={FileText}
          description="Documented test cases"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Test Suites"
          value={mockDashboardStats.totalTestSuites}
          icon={Layers}
          description="Organized test suites"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Test Runs"
          value={mockDashboardStats.totalTestRuns}
          icon={PlayCircle}
          description="Executed test runs"
          trend={{ value: 5, positive: false }}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TestRunsTable />
        </div>
        
        <div className="space-y-6">
          <PassFailSummary />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Dashboard | TestPilot',
  description: 'TestPilot Dashboard - Test management overview',
}
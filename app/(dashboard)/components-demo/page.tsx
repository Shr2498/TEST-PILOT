'use client'

import { 
  FolderOpen, 
  FileText, 
  Play, 
  Plus,
  Settings,
  Trash2,
  Edit,
  Eye,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Import all our new components
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { PriorityBadge } from '@/components/ui/priority-badge'
import { SearchToolbar } from '@/components/ui/search-toolbar'
import { DataTable } from '@/components/ui/data-table'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { 
  EmptyProjects, 
  EmptyTestCases, 
  EmptyTestSuites, 
  EmptyTestRuns,
  EmptySearchResults,
  EmptyReports 
} from '@/components/ui/empty-states'

export default function ComponentsDemoPage() {
  const sampleData = [
    {
      id: 1,
      name: 'Login Test Case',
      status: 'active',
      priority: 'high',
      project: 'Web App Testing',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Registration Flow',
      status: 'inactive',
      priority: 'medium',
      project: 'Mobile App',
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      name: 'Payment Integration',
      status: 'active',
      priority: 'critical',
      project: 'E-commerce',
      createdAt: '2024-01-13'
    }
  ]

  const columns = [
    { key: 'name', header: 'Name' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => <StatusBadge status={value as any} />
    },
    { 
      key: 'priority', 
      header: 'Priority',
      render: (value: string) => <PriorityBadge priority={value as any} />
    },
    { key: 'project', header: 'Project' },
    { key: 'createdAt', header: 'Created' }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header Component */}
      <PageHeader
        title="UI Components Demo"
        description="Showcasing all reusable components in TestPilot"
        icon={<Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Component
          </Button>
        }
      />

      {/* Stats Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Stat Cards</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Projects"
            value={24}
            description="Active projects"
            icon={<FolderOpen className="h-8 w-8" />}
          />
          <StatCard
            title="Test Cases"
            value={156}
            description="Ready to run"
            icon={<FileText className="h-8 w-8" />}
            variant="success"
          />
          <StatCard
            title="Test Runs"
            value={89}
            description="This month"
            icon={<Play className="h-8 w-8" />}
            variant="warning"
          />
          <StatCard
            title="Pass Rate"
            value="94.2%"
            description="Last 30 days"
            icon={<CheckCircle className="h-8 w-8" />}
            variant="danger"
          />
        </div>
      </section>

      {/* Status & Priority Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="space-y-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Status Badges</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="active" />
              <StatusBadge status="inactive" />
              <StatusBadge status="completed" />
              <StatusBadge status="blocked" />
              <StatusBadge status="running" />
              <StatusBadge status="failed" />
              <StatusBadge status="archived" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Priority Badges</h3>
            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority="critical" />
              <PriorityBadge priority="high" />
              <PriorityBadge priority="medium" />
              <PriorityBadge priority="low" />
            </div>
          </div>
        </div>
      </section>

      {/* Search Toolbar */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Search Toolbar</h2>
        <SearchToolbar
          searchPlaceholder="Search test cases..."
          onSearchChange={(query: string) => console.log('Search:', query)}
          filters={[
            { 
              key: 'status', 
              label: 'Status', 
              options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'completed', label: 'Completed' }
              ]
            },
            { 
              key: 'priority', 
              label: 'Priority', 
              options: [
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }
              ]
            }
          ]}
          onFilterChange={(key: string, value: string | null) => console.log('Filter:', key, value)}
        />
      </section>

      {/* Data Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Data Table</h2>
        <DataTable
          data={sampleData}
          columns={columns}
          emptyState={<EmptyTestCases />}
          actions={
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => console.log('View action')}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => console.log('Edit action')}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          }
        />
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Loading States</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Card Loading</h3>
            <LoadingState variant="card" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Table Loading</h3>
            <LoadingState variant="table" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Dashboard Loading</h3>
            <LoadingState variant="dashboard" />
          </div>
        </div>
      </section>

      {/* Error States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Error States</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">General Error</h3>
            <ErrorState 
              error="Something went wrong loading the data"
              showRetry
              onRetry={() => console.log('Retry clicked')}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Network Error</h3>
            <ErrorState 
              type="network"
              error="Failed to connect to server"
              showRetry
              onRetry={() => console.log('Retry network')}
            />
          </div>
        </div>
      </section>

      {/* Empty States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Empty States</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Projects</h3>
            <div className="border rounded-lg p-4">
              <EmptyProjects />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Test Cases</h3>
            <div className="border rounded-lg p-4">
              <EmptyTestCases />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Test Suites</h3>
            <div className="border rounded-lg p-4">
              <EmptyTestSuites />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Test Runs</h3>
            <div className="border rounded-lg p-4">
              <EmptyTestRuns />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Search Results</h3>
            <div className="border rounded-lg p-4">
              <EmptySearchResults 
                resource="Test Cases" 
                searchTerm="example search" 
                onClearSearch={() => console.log('Clear search')} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Reports</h3>
            <div className="border rounded-lg p-4">
              <EmptyReports />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Components */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Interactive Components</h2>
        <div className="flex space-x-4">
          <ConfirmDialog
            title="Delete Project"
            description="Are you sure you want to delete this project? This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => console.log('Confirmed delete')}
          >
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </Button>
          </ConfirmDialog>
        </div>
      </section>
    </div>
  )
}
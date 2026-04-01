import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { 
  FolderOpen, 
  FileText, 
  Layers, 
  PlayCircle, 
  Plus, 
  Search,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

// Project empty states
export function EmptyProjects() {
  return (
    <EmptyState
      icon={<FolderOpen className="h-12 w-12" />}
      title="No Projects Yet"
      description="Get started by creating your first project to organize your test cases and suites."
      action={{
        label: "Create Project",
        href: "/projects/new"
      }}
      secondaryAction={{
        label: "Learn More",
        href: "/docs/projects",
        variant: "outline"
      }}
    />
  )
}

// Test case empty states
export function EmptyTestCases({ projectId }: { projectId?: string }) {
  const createUrl = projectId ? `/test-cases/new?project=${projectId}` : '/test-cases/new'
  
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="No Test Cases Yet"
      description="Create detailed test cases with step-by-step instructions to ensure comprehensive testing coverage."
      action={{
        label: "Create Test Case",
        href: createUrl
      }}
      secondaryAction={{
        label: "View All Projects",
        href: "/projects",
        variant: "outline"
      }}
    />
  )
}

// Test suite empty states
export function EmptyTestSuites({ projectId }: { projectId?: string }) {
  const createUrl = projectId ? `/test-suites/new?project=${projectId}` : '/test-suites/new'
  
  return (
    <EmptyState
      icon={<Layers className="h-12 w-12" />}
      title="No Test Suites Yet"
      description="Organize your test cases into suites for better management and execution planning."
      action={{
        label: "Create Test Suite",
        href: createUrl
      }}
      secondaryAction={{
        label: "Create Test Case",
        href: `/test-cases/new${projectId ? `?project=${projectId}` : ''}`,
        variant: "outline"
      }}
    />
  )
}

// Test run empty states
export function EmptyTestRuns({ projectId }: { projectId?: string }) {
  return (
    <EmptyState
      icon={<PlayCircle className="h-12 w-12" />}
      title="No Test Runs Yet"
      description="Execute your test suites to track results and monitor your application's quality over time."
      action={{
        label: "Start Test Run",
        href: `/test-runs/new${projectId ? `?project=${projectId}` : ''}`
      }}
      secondaryAction={{
        label: "View Test Suites",
        href: `/test-suites${projectId ? `?project=${projectId}` : ''}`,
        variant: "outline"
      }}
    />
  )
}

// Search/filter empty states
export function EmptySearchResults({ 
  resource, 
  searchTerm,
  onClearSearch 
}: { 
  resource: string
  searchTerm?: string
  onClearSearch?: () => void 
}) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12" />}
      title="No Results Found"
      description={`No ${resource} match your current search${searchTerm ? ` for "${searchTerm}"` : ' criteria'}.`}
      action={onClearSearch ? {
        label: "Clear Search",
        onClick: onClearSearch
      } : undefined}
      secondaryAction={{
        label: `View All ${resource}`,
        href: `/${resource.toLowerCase()}`,
        variant: "outline"
      }}
    />
  )
}

// Reports empty state
export function EmptyReports() {
  return (
    <EmptyState
      icon={<BarChart3 className="h-12 w-12" />}
      title="No Test Data Yet"
      description="Start testing to generate reports and analytics. Create a project and run some tests to see insights here."
      action={{
        label: "Create Project",
        href: "/projects/new"
      }}
      secondaryAction={{
        label: "Create Test Case",
        href: "/test-cases/new",
        variant: "outline"
      }}
    />
  )
}

// Generic loading error state
export function LoadingError({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="Failed to Load Data"
      description="We encountered an error while loading the data. Please try again."
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
      secondaryAction={{
        label: "Go to Dashboard",
        href: "/dashboard",
        variant: "outline"
      }}
    />
  )
}
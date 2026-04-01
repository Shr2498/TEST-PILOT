import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FolderOpen, FileText, Calendar, User, Archive, Pause } from 'lucide-react'
import { getProjects } from '@/lib/actions/projects'
import { formatDistanceToNow, format } from 'date-fns'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { EmptyProjects } from '@/components/ui/empty-states'
import { StatusBadge } from '@/components/ui/status-badge'
import { ErrorState } from '@/components/ui/error-state'

function ProjectCard({ project }: { project: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg">
              <Link 
                href={`/projects/${project.id}`}
                className="hover:underline"
              >
                {project.name}
              </Link>
            </CardTitle>
          </div>
          <StatusBadge status={project.status} />
        </div>
        {project.description && (
          <CardDescription className="mt-2">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{project._count.testCases} test cases</span>
            </div>
            <div className="flex items-center space-x-1">
              <FolderOpen className="h-4 w-4" />
              <span>{project._count.testSuites} suites</span>
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{project.owner.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



export default async function ProjectsPage() {
  const { projects, error } = await getProjects()

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Projects"
          description="Organize and manage your testing projects"
          icon={<FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        />
        <ErrorState 
          error={error}
          showRetry
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Organize and manage your testing projects"
        icon={<FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        action={
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        }
      />

      {/* Project Stats */}
      {projects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Projects"
            value={projects.length}
            description="All projects"
            icon={<FolderOpen className="h-8 w-8" />}
          />
          <StatCard
            title="Active Projects"
            value={projects.filter(p => p.status === 'active').length}
            description="Currently active"
            icon={<FolderOpen className="h-8 w-8" />}
            variant="success"
          />
          <StatCard
            title="Total Test Cases"
            value={projects.reduce((sum, p) => sum + p._count.testCases, 0)}
            description="Across all projects"
            icon={<FileText className="h-8 w-8" />}
            variant="default"
          />
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export const metadata = {
  title: 'Projects | TestPilot',
  description: 'Manage your testing projects',
}
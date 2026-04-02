import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, FileText, FolderOpen, Calendar, User, Settings } from 'lucide-react'
import { getProject } from '@/lib/actions/projects'
import { formatDistanceToNow, format } from 'date-fns'
import { DeleteProjectButton } from '@/components/forms/delete-project-button'
import { StatusBadge } from '@/components/ui/status-badge'

export default async function ProjectDetailPage({ 
  params 
}: Readonly<{ 
  params: { id: string } 
}>) {
  const { data, error } = await getProject(params.id)
  const project = data?.project

  if (error || !project) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <StatusBadge status={project.status as any} />
            </div>
            {project.description && (
              <p className="text-muted-foreground mt-2">
                {project.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/projects/${project.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Link>
          </Button>
          <DeleteProjectButton projectId={project.id} projectName={project.name} />
        </div>
      </div>

      {/* Project Info Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Test Cases</span>
              </div>
              <span className="font-semibold">{project._count.testCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Test Suites</span>
              </div>
              <span className="font-semibold">{project._count.testSuites}</span>
            </div>
          </CardContent>
        </Card>

        {/* Project Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                <span>Project Owner</span>
              </div>
              <p className="font-medium">{project.owner.name}</p>
              <p className="text-sm text-muted-foreground">{project.owner.email}</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span>Created</span>
              </div>
              <p className="font-medium">{format(new Date(project.createdAt), 'MMM dd, yyyy')}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href={`/test-cases/new?project=${project.id}`}>
                <FileText className="h-4 w-4 mr-2" />
                Create Test Case
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href={`/test-suites/new?project=${project.id}`}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Create Test Suite
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href={`/projects/${project.id}/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                Project Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Test Cases</CardTitle>
          <CardDescription>
            Latest test cases created in this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <p>No test cases yet</p>
            <Button asChild className="mt-4">
              <Link href={`/test-cases/new?project=${project.id}`}>
                Create First Test Case
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: 'Project Details | TestPilot',
  description: 'View project details and manage test cases',
}
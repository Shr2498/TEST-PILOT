import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import { getProject } from '@/lib/actions/projects'
import { EditProjectForm } from '@/components/forms/edit-project-form'

export default async function EditProjectPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { data, error } = await getProject(params.id)
  const project = data?.project

  if (error || !project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/projects/${project.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Link>
        </Button>
        <div>
          <div className="flex items-center space-x-3">
            <Edit className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
          </div>
          <p className="text-muted-foreground">
            Modify {project.name} settings and information
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="max-w-2xl">
        <EditProjectForm project={project} />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Edit Project | TestPilot',
  description: 'Edit project information and settings',
}
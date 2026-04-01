'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, FolderPlus } from 'lucide-react'
import { projectSchema, type ProjectFormData } from '@/lib/validations/modules'
import { createProject } from '@/lib/actions/projects'
import { useFormRequest } from '@/hooks/use-form-request'
import { PageHeader } from '@/components/ui/page-header'

export default function NewProjectPage() {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active'
    }
  })

  const { handleSubmit, isLoading, error } = useFormRequest<ProjectFormData>(createProject, {
    onSuccess: (data) => {
      if (data?.project) {
        window.location.href = `/projects/${data.project.id}`
      }
    }
  })

  const status = form.watch('status')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Project"
        description="Set up a new testing project to organize your test cases"
        icon={<FolderPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        action={
          <Button variant="outline" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        }
      />

      {/* Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide basic information about your testing project
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(handleSubmit(form))} className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., E-commerce Web App"
                  {...form.register('name')}
                  className={form.formState.errors.name ? 'border-destructive' : ''}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what this project covers..."
                  rows={3}
                  {...form.register('description')}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select value={status} onValueChange={(value) => form.setValue('status', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/projects">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
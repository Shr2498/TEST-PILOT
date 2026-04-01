'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { projectSchema, type ProjectFormData } from '@/lib/validations/modules'
import { requireAuth } from '@/lib/auth-utils'
import { handleServerAction } from '@/lib/errors'

export async function getProjects() {
  const user = await requireAuth()
  
  try {
    const projects = await prisma.project.findMany({
      where: {
        team: {
          members: {
            some: {
              id: user.id
            }
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        _count: {
          select: {
            testCases: true,
            testSuites: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return { projects, error: null }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return { projects: [], error: 'Failed to fetch projects' }
  }
}

export async function getProject(id: string) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const project = await prisma.project.findFirst({
      where: {
        id,
        team: {
          members: {
            some: {
              id: user.id
            }
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        team: true,
        _count: {
          select: {
            testCases: true,
            testSuites: true,
          }
        }
      }
    })
    
    if (!project) {
      throw new Error('Project not found')
    }
    
    return { project }
  }, 'fetch project')
}

export async function createProject(data: ProjectFormData) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const validatedData = projectSchema.parse(data)
    
    // Generate a slug from the project name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const project = await prisma.project.create({
      data: {
        ...validatedData,
        slug,
        ownerId: user.id,
        teamId: user.teamId || '',
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })
    
    revalidatePath('/projects')
    return { project }
  }, 'create project')
}

export async function updateProject(id: string, data: ProjectFormData) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const validatedData = projectSchema.parse(data)
    
    // Check if user has access to this project
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        team: {
          members: {
            some: {
              id: user.id
            }
          }
        }
      }
    })
    
    if (!existingProject) {
      throw new Error('Project not found or access denied')
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: validatedData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })
    
    revalidatePath('/projects')
    revalidatePath(`/projects/${id}`)
    return { project }
  }, 'update project')
}

export async function deleteProject(id: string) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id,
        team: {
          members: {
            some: {
              id: user.id
            }
          }
        }
      }
    })
    
    if (!project) {
      throw new Error('Project not found or access denied')
    }
    
    await prisma.project.delete({
      where: { id }
    })
    
    revalidatePath('/projects')
    return { success: true }
  }, 'delete project')
}
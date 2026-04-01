'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { handleServerAction } from '@/lib/errors'
import { testSuiteSchema, type TestSuiteFormData } from '@/lib/validations/modules'

export async function getTestSuites() {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const testSuites = await prisma.testSuite.findMany({
      where: {
        project: {
          team: {
            members: {
              some: {
                id: user.id
              }
            }
          }
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            testSuiteItems: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return { testSuites }
  }, 'fetch test suites')
}

export async function getTestSuite(id: string) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const testSuite = await prisma.testSuite.findFirst({
      where: {
        id,
        project: {
          team: {
            members: {
              some: {
                id: user.id
              }
            }
          }
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          }
        },
        testSuiteItems: {
          include: {
            testCase: {
              include: {
                _count: {
                  select: {
                    testSteps: true,
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            testSuiteItems: true,
          }
        }
      }
    })
    
    if (!testSuite) {
      throw new Error('Test suite not found')
    }
    
    return { testSuite }
  }, 'fetch test suite')
}

export async function createTestSuite(data: TestSuiteFormData) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const validatedData = testSuiteSchema.parse(data)
    
    // Verify user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: validatedData.projectId,
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
    
    const testSuite = await prisma.testSuite.create({
      data: validatedData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
    
    revalidatePath('/test-suites')
    revalidatePath(`/projects/${validatedData.projectId}`)
    return { testSuite }
  }, 'create test suite')
}

export async function updateTestSuite(id: string, data: TestSuiteFormData) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const validatedData = testSuiteSchema.parse(data)
    
    // Check if user has access to this test suite
    const existingTestSuite = await prisma.testSuite.findFirst({
      where: {
        id,
        project: {
          team: {
            members: {
              some: {
                id: user.id
              }
            }
          }
        }
      }
    })
    
    if (!existingTestSuite) {
      throw new Error('Test suite not found or access denied')
    }
    
    const testSuite = await prisma.testSuite.update({
      where: { id },
      data: validatedData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
    
    revalidatePath('/test-suites')
    revalidatePath(`/test-suites/${id}`)
    revalidatePath(`/projects/${testSuite.projectId}`)
    return { testSuite }
  }, 'update test suite')
}

export async function deleteTestSuite(id: string) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    // Check if user has access to this test suite
    const testSuite = await prisma.testSuite.findFirst({
      where: {
        id,
        project: {
          team: {
            members: {
              some: {
                id: user.id
              }
            }
          }
        }
      }
    })
    
    if (!testSuite) {
      throw new Error('Test suite not found or access denied')
    }
    
    await prisma.testSuite.delete({
      where: { id }
    })
    
    revalidatePath('/test-suites')
    revalidatePath(`/projects/${testSuite.projectId}`)
    return { success: true }
  }, 'delete test suite')
}
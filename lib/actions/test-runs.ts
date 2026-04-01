'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { handleServerAction } from '@/lib/errors'
import { testRunSchema, type TestRunFormData } from '@/lib/validations/modules'

export async function getTestRuns() {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const testRuns = await prisma.testRun.findMany({
      where: {
        testSuite: {
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
      },
      include: {
        testSuite: {
          select: {
            id: true,
            name: true,
            project: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        _count: {
          select: {
            testRunResults: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return { testRuns }
  }, 'fetch test runs')
}

export async function getTestRun(id: string) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const testRun = await prisma.testRun.findFirst({
      where: {
        id,
        testSuite: {
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
      },
      include: {
        testSuite: {
          select: {
            id: true,
            name: true,
            project: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        testRunResults: {
          include: {
            testCase: {
              select: {
                id: true,
                title: true,
              }
            }
          }
        },
        _count: {
          select: {
            testRunResults: true,
          }
        }
      }
    })
    
    if (!testRun) {
      throw new Error('Test run not found')
    }
    
    return { testRun }
  }, 'fetch test run')
}

export async function createTestRun(data: TestRunFormData) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const validatedData = testRunSchema.parse(data)
    
    // Verify user has access to the test suite
    const testSuite = await prisma.testSuite.findFirst({
      where: {
        id: validatedData.testSuiteId,
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
        testSuiteItems: {
          include: {
            testCase: true
          }
        }
      }
    })
    
    if (!testSuite) {
      throw new Error('Test suite not found or access denied')
    }
    
    const testRun = await prisma.testRun.create({
      data: {
        ...validatedData,
        assignedUserId: user.id,
        status: 'pending',
      },
      include: {
        testSuite: {
          select: {
            id: true,
            name: true,
            project: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    })
    
    // Create individual test results for each test case in the suite
    const resultData = testSuite.testSuiteItems.map(item => ({
      testRunId: testRun.id,
      testCaseId: item.testCase.id,
      status: 'not_run' as const,
    }))
    
    await prisma.testRunResult.createMany({
      data: resultData
    })
    
    revalidatePath('/test-runs')
    revalidatePath(`/test-suites/${validatedData.testSuiteId}`)
    return { testRun }
  }, 'create test run')
}

export async function updateTestRun(id: string, data: TestRunFormData) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    const validatedData = testRunSchema.parse(data)
    
    // Check if user has access to this test run
    const existingTestRun = await prisma.testRun.findFirst({
      where: {
        id,
        testSuite: {
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
      }
    })
    
    if (!existingTestRun) {
      throw new Error('Test run not found or access denied')
    }
    
    const testRun = await prisma.testRun.update({
      where: { id },
      data: validatedData,
      include: {
        testSuite: {
          select: {
            id: true,
            name: true,
            project: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    })
    
    revalidatePath('/test-runs')
    revalidatePath(`/test-runs/${id}`)
    revalidatePath(`/test-suites/${testRun.testSuiteId}`)
    return { testRun }
  }, 'update test run')
}

export async function deleteTestRun(id: string) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    // Check if user has access to this test run
    const testRun = await prisma.testRun.findFirst({
      where: {
        id,
        testSuite: {
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
      }
    })
    
    if (!testRun) {
      throw new Error('Test run not found or access denied')
    }
    
    // Delete associated results first
    await prisma.testRunResult.deleteMany({
      where: { testRunId: id }
    })
    
    await prisma.testRun.delete({
      where: { id }
    })
    
    revalidatePath('/test-runs')
    revalidatePath(`/test-suites/${testRun.testSuiteId}`)
    return { success: true }
  }, 'delete test run')
}

export async function updateTestResult(testRunId: string, testCaseId: string, status: string, notes?: string) {
  return handleServerAction(async () => {
    const user = await requireAuth()
    
    // Verify user has access to this test run
    const testRun = await prisma.testRun.findFirst({
      where: {
        id: testRunId,
        testSuite: {
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
      }
    })
    
    if (!testRun) {
      throw new Error('Test run not found or access denied')
    }
    
    const result = await prisma.testRunResult.update({
      where: {
        testRunId_testCaseId: {
          testRunId,
          testCaseId,
        }
      },
      data: {
        status,
        notes,
        executedAt: new Date(),
      }
    })
    
    // Update test run status based on results
    const allResults = await prisma.testRunResult.findMany({
      where: { testRunId }
    })
    
    const hasRunning = allResults.some(r => r.status === 'running')
    const allCompleted = allResults.every(r => r.status !== 'not_run' && r.status !== 'running')
    const hasFailed = allResults.some(r => r.status === 'failed')
    
    let runStatus = 'pending'
    if (hasRunning) {
      runStatus = 'running'
    } else if (allCompleted) {
      runStatus = hasFailed ? 'failed' : 'completed'
    }
    
    await prisma.testRun.update({
      where: { id: testRunId },
      data: { 
        status: runStatus,
        completedAt: allCompleted ? new Date() : null
      }
    })
    
    revalidatePath(`/test-runs/${testRunId}`)
    revalidatePath('/test-runs')
    return { result }
  }, 'update test result')
}
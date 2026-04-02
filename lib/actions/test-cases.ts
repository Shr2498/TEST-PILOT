'use server'

import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { testCaseSchema, testStepSchema } from '@/lib/validations/modules'
import { z } from 'zod'

// Types for test case operations
export type TestCaseFormData = z.infer<typeof testCaseSchema>
export type TestStepFormData = z.infer<typeof testStepSchema>

export interface TestCaseWithSteps {
  id: string
  title: string
  description: string | null
  priority: string
  expectedResult: string | null
  createdAt: Date
  updatedAt: Date
  project: {
    id: string
    name: string
  }
  testSteps: {
    id: string
    stepNumber: number
    action: string
    expected: string | null
    notes: string | null
  }[]
}

export async function getTestCases(projectId?: string): Promise<{
  testCases: TestCaseWithSteps[]
  error: string | null
}> {
  try {
    const user = await requireAuth()

    const whereClause = {
      project: {
        ownerId: user.id,
        ...(projectId && { id: projectId })
      }
    }

    const testCases = await prisma.testCase.findMany({
      where: whereClause,
      include: {
        project: {
          select: { id: true, name: true }
        },
        testSteps: {
          orderBy: { stepNumber: 'asc' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { testCases, error: null }
  } catch (error) {
    console.error('Error fetching test cases:', error)
    return { testCases: [], error: 'Failed to fetch test cases' }
  }
}

export async function getTestCase(id: string): Promise<{
  testCase: TestCaseWithSteps | null
  error: string | null
}> {
  try {
    const user = await requireAuth()

    const testCase = await prisma.testCase.findFirst({
      where: {
        id,
        project: {
          ownerId: user.id
        }
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        testSteps: {
          orderBy: { stepNumber: 'asc' }
        }
      }
    })

    return { testCase, error: null }
  } catch (error) {
    console.error('Error fetching test case:', error)
    return { testCase: null, error: 'Failed to fetch test case' }
  }
}

export async function createTestCase(
  data: TestCaseFormData & { 
    steps: Omit<TestStepFormData, 'testCaseId'>[] 
  }
): Promise<{
  testCase: { id: string } | null
  error: string | null
}> {
  try {
    const user = await requireAuth()
    
    // Validate the main test case data
    const validatedData = testCaseSchema.parse(data)
    
    // Validate steps
    const validatedSteps = data.steps.map((step, index) => 
      testStepSchema.omit({ testCaseId: true }).parse({
        ...step,
        stepNumber: index + 1
      })
    )

    // Verify the user owns the project
    const project = await prisma.project.findFirst({
      where: {
        id: validatedData.projectId,
        ownerId: user.id
      }
    })

    if (!project) {
      return { testCase: null, error: 'Project not found or access denied' }
    }

    // Create test case with steps in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const { tags, ...testCaseData } = validatedData
      const testCase = await tx.testCase.create({
        data: testCaseData
      })

      if (validatedSteps.length > 0) {
        await tx.testStep.createMany({
          data: validatedSteps.map(step => ({
            ...step,
            testCaseId: testCase.id
          }))
        })
      }

      return testCase
    })

    revalidatePath('/test-cases')
    revalidatePath(`/projects/${validatedData.projectId}`)

    return { testCase: result, error: null }
  } catch (error) {
    console.error('Error creating test case:', error)
    return { testCase: null, error: 'Failed to create test case' }
  }
}

export async function updateTestCase(
  id: string,
  data: TestCaseFormData & { 
    steps: (TestStepFormData & { id?: string })[] 
  }
): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const user = await requireAuth()
    
    // Validate the test case data
    const validatedData = testCaseSchema.parse(data)
    
    // Validate steps
    const validatedSteps = data.steps.map((step, index) => ({
      ...testStepSchema.parse({
        ...step,
        testCaseId: id,
        stepNumber: index + 1
      }),
      id: step.id
    }))

    // Verify ownership
    const existingTestCase = await prisma.testCase.findFirst({
      where: {
        id,
        project: {
          ownerId: user.id
        }
      }
    })

    if (!existingTestCase) {
      return { success: false, error: 'Test case not found or access denied' }
    }

    // Update test case and steps in transaction
    await prisma.$transaction(async (tx) => {
      // Update test case
      const { tags, ...testCaseData } = validatedData
      await tx.testCase.update({
        where: { id },
        data: testCaseData
      })

      // Delete existing steps
      await tx.testStep.deleteMany({
        where: { testCaseId: id }
      })

      // Create new steps
      if (validatedSteps.length > 0) {
        await tx.testStep.createMany({
          data: validatedSteps.map(({ id: _id, ...step }) => ({
            ...step,
            testCaseId: id
          }))
        })
      }
    })

    revalidatePath('/test-cases')
    revalidatePath(`/test-cases/${id}`)
    revalidatePath(`/projects/${validatedData.projectId}`)

    return { success: true, error: null }
  } catch (error) {
    console.error('Error updating test case:', error)
    return { success: false, error: 'Failed to update test case' }
  }
}

export async function deleteTestCase(id: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const user = await requireAuth()
    
    // Verify ownership and get project ID for revalidation
    const testCase = await prisma.testCase.findFirst({
      where: {
        id,
        project: {
          ownerId: user.id
        }
      },
      select: {
        projectId: true
      }
    })

    if (!testCase) {
      return { success: false, error: 'Test case not found or access denied' }
    }

    // Delete test case (steps will be deleted via cascade)
    await prisma.testCase.delete({
      where: { id }
    })

    revalidatePath('/test-cases')
    revalidatePath(`/projects/${testCase.projectId}`)

    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting test case:', error)
    return { success: false, error: 'Failed to delete test case' }
  }
}
'use server'

import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { handleServerAction } from '@/lib/errors'

export interface TestRunSummary {
  id: string
  name: string
  status: string
  passedCount: number
  failedCount: number
  blockedCount: number
  notRunCount: number
  totalCount: number
  passRate: number
  createdAt: Date
  project: {
    id: string
    name: string
  }
  testSuite: {
    id: string
    name: string
  }
}

export interface ProjectSummary {
  id: string
  name: string
  testCasesCount: number
  testSuitesCount: number
  testRunsCount: number
  lastRunAt: Date | null
  avgPassRate: number
}

export interface ReportsData {
  totalTestRuns: number
  totalPassed: number
  totalFailed: number
  totalBlocked: number
  totalNotRun: number
  overallPassRate: number
  recentRuns: TestRunSummary[]
  projectSummaries: ProjectSummary[]
}

export async function getReportsData(): Promise<{
  data: ReportsData | null
  error: string | null
}> {
  try {
    const user = await requireAuth()

    // Get all test runs for the user
    const testRuns = await prisma.testRun.findMany({
      where: {
        testSuite: {
          project: {
            ownerId: user.id
          }
        }
      },
      include: {
        testSuite: {
          select: { 
            id: true, 
            name: true,
            project: {
              select: { id: true, name: true }
            }
          }
        },
        testRunResults: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate overall statistics
    let totalPassed = 0
    let totalFailed = 0
    let totalBlocked = 0
    let totalNotRun = 0

    const recentRuns: TestRunSummary[] = testRuns.slice(0, 10).map(run => {
      const passedCount = run.testRunResults.filter(r => r.status === 'pass').length
      const failedCount = run.testRunResults.filter(r => r.status === 'fail').length
      const blockedCount = run.testRunResults.filter(r => r.status === 'blocked').length
      const notRunCount = run.testRunResults.filter(r => r.status === 'not_run').length
      const totalCount = run.testRunResults.length
      const passRate = totalCount > 0 ? (passedCount / totalCount) * 100 : 0

      // Add to overall totals
      totalPassed += passedCount
      totalFailed += failedCount
      totalBlocked += blockedCount
      totalNotRun += notRunCount

      return {
        id: run.id,
        name: run.name,
        status: run.status,
        passedCount,
        failedCount,
        blockedCount,
        notRunCount,
        totalCount,
        passRate,
        createdAt: run.createdAt,
        project: run.testSuite.project,
        testSuite: run.testSuite
      }
    })

    // Calculate overall pass rate
    const totalTests = totalPassed + totalFailed + totalBlocked + totalNotRun
    const overallPassRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0

    // Get project summaries
    const projects = await prisma.project.findMany({
      where: {
        ownerId: user.id
      },
      include: {
        testCases: true,
        testSuites: {
          include: {
            testRuns: {
              include: {
                testRunResults: true
              },
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        }
      }
    })

    const projectSummaries: ProjectSummary[] = projects.map(project => {
      // Get all test runs from all test suites in this project
      const allTestRuns = project.testSuites.flatMap(suite => suite.testRuns)
      const testRunsCount = allTestRuns.length
      const lastRun = allTestRuns.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
      
      // Calculate average pass rate for project
      let totalPassRate = 0
      let validRuns = 0
      
      allTestRuns.forEach(run => {
        const passed = run.testRunResults.filter(r => r.status === 'pass').length
        const total = run.testRunResults.length
        if (total > 0) {
          totalPassRate += (passed / total) * 100
          validRuns++
        }
      })
      
      const avgPassRate = validRuns > 0 ? totalPassRate / validRuns : 0

      return {
        id: project.id,
        name: project.name,
        testCasesCount: project.testCases.length,
        testSuitesCount: project.testSuites.length,
        testRunsCount,
        lastRunAt: lastRun?.createdAt || null,
        avgPassRate
      }
    })

    return {
      data: {
        totalTestRuns: testRuns.length,
        totalPassed,
        totalFailed,
        totalBlocked,
        totalNotRun,
        overallPassRate,
        recentRuns,
        projectSummaries
      },
      error: null
    }
  } catch (error) {
    console.error('Error fetching reports data:', error)
    return {
      data: null,
      error: 'Failed to fetch reports data'
    }
  }
}
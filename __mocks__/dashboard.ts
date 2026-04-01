/**
 * Mock data for dashboard development
 * TODO: Replace with real API calls when backend is ready
 */

export const mockDashboardStats = {
  totalProjects: 4,
  totalTestCases: 47,
  totalTestSuites: 12,
  totalTestRuns: 23,
  recentTestRuns: [
    {
      id: 1,
      name: "User Authentication Flow",
      project: "E-commerce App",
      status: "completed",
      passed: 8,
      failed: 2,
      blocked: 0,
      notRun: 0,
      completedAt: "2024-03-27T10:30:00Z",
      assignee: "Sarah Chen"
    },
    {
      id: 2,
      name: "Payment Processing",
      project: "E-commerce App", 
      status: "in-progress",
      passed: 3,
      failed: 1,
      blocked: 1,
      notRun: 5,
      completedAt: null,
      assignee: "Mike Johnson"
    },
    {
      id: 3,
      name: "Mobile Responsive Design",
      project: "Marketing Site",
      status: "completed",
      passed: 12,
      failed: 0,
      blocked: 0,
      notRun: 0,
      completedAt: "2024-03-26T15:45:00Z",
      assignee: "Alex Rodriguez"
    },
    {
      id: 4,
      name: "API Integration Tests",
      project: "CRM System",
      status: "failed",
      passed: 5,
      failed: 3,
      blocked: 2,
      notRun: 0,
      completedAt: "2024-03-26T09:15:00Z",
      assignee: "Sarah Chen"
    }
  ],
  overallStats: {
    totalTests: 156,
    passed: 134,
    failed: 12,
    blocked: 8,
    notRun: 2,
    passRate: 85.9
  }
}

export type MockDashboardStats = typeof mockDashboardStats
export type TestRunSummary = typeof mockDashboardStats.recentTestRuns[0]
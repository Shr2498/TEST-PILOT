# TestPilot Database Schema Documentation

## Relationship Explanations

### 1. User ↔ Team (Many-to-One)

- Each user belongs to exactly one team/workspace
- A team can have multiple users with different roles
- Users are deleted when their team is deleted (CASCADE)

### 2. Team ↔ Project (One-to-Many)

- Each project belongs to exactly one team
- A team can have multiple projects
- Projects are deleted when their team is deleted (CASCADE)
- Slug uniqueness is scoped to team level

### 3. Project ↔ TestCase (One-to-Many)

- Each test case belongs to exactly one project
- A project can have multiple test cases
- Test cases are deleted when their project is deleted (CASCADE)
- Users can be assigned to test cases (optional)

### 4. TestCase ↔ TestStep (One-to-Many)

- Each test step belongs to exactly one test case
- A test case can have multiple ordered test steps
- Test steps are deleted when their test case is deleted (CASCADE)
- Steps are ordered by stepNumber within each test case

### 5. Project ↔ TestSuite (One-to-Many)

- Each test suite belongs to exactly one project
- A project can have multiple test suites
- Test suites are deleted when their project is deleted (CASCADE)

### 6. TestSuite ↔ TestCase (Many-to-Many via TestSuiteItem)

- Test cases can belong to multiple test suites
- Test suites can contain multiple test cases
- TestSuiteItem maintains the order of test cases within a suite
- Junction table ensures referential integrity

### 7. TestSuite ↔ TestRun (One-to-Many)

- Each test run is created from exactly one test suite
- A test suite can have multiple test runs (different execution cycles)
- Test runs are deleted when their test suite is deleted (CASCADE)
- Users can be assigned to execute test runs

### 8. TestRun ↔ TestRunResult (One-to-Many)

- Each test run has multiple results (one per test case in the suite)
- TestRunResult links a specific test case execution to a test run
- Results are deleted when their test run is deleted (CASCADE)
- Users can record who actually executed each test case

### 9. TestCase ↔ Tag (Many-to-Many via TestCaseTag)

- Test cases can have multiple tags
- Tags can be reused across multiple test cases
- Junction table for efficient querying and filtering
- Tags persist even if all test cases using them are deleted

## Indexing Strategy for Performance

### Primary Indexes (Automatic)

- All `@id` fields automatically have unique indexes
- All `@unique` fields have unique indexes

### Foreign Key Indexes (Added)

```prisma
// User table
@@index([teamId])

// Project table  
@@index([teamId])

// TestCase table
@@index([projectId])
@@index([status])
@@index([priority])
@@index([assignedUserId])

// TestStep table
@@index([testCaseId])

// TestSuite table
@@index([projectId])

// TestSuiteItem table
@@index([testSuiteId])

// TestRun table
@@index([testSuiteId])
@@index([status])
@@index([assignedUserId])

// TestRunResult table
@@index([testRunId])
@@index([status])
```

### Additional Performance Considerations

#### Composite Indexes (Consider adding based on query patterns)

```sql
-- For filtering test cases by project and status
CREATE INDEX idx_test_cases_project_status ON test_cases(project_id, status);

-- For filtering test cases by project and priority
CREATE INDEX idx_test_cases_project_priority ON test_cases(project_id, priority);

-- For time-based queries on test runs
CREATE INDEX idx_test_runs_created_at ON test_runs(created_at);
CREATE INDEX idx_test_runs_completed_at ON test_runs(completed_at);

-- For dashboard queries showing recent activity
CREATE INDEX idx_test_cases_updated_at ON test_cases(updated_at);
CREATE INDEX idx_test_runs_updated_at ON test_runs(updated_at);
```

#### Query Optimization Notes

1. **Dashboard Queries**: Index on `updatedAt` fields for recent activity feeds
2. **Filtering**: Status and priority filters are indexed for fast test case filtering
3. **Assignment Queries**: User assignment indexes for "my test cases" and "my test runs" views
4. **Reporting**: TestRunResult status index for execution statistics
5. **Search**: Consider full-text search indexes on title/description fields if needed

#### Memory Considerations

- Keep indexed fields lean (avoid indexing large text fields)
- Monitor index usage with database query analysis tools
- Consider partial indexes for frequently filtered subsets (e.g., active test cases only)

## Data Integrity Features

### Cascade Deletes

- Deleting a team removes all projects, test cases, and related data
- Deleting a project removes all test cases, test suites, and test runs
- Deleting a test case removes all test steps and results

### Soft Deletes Alternative

Consider adding `deletedAt DateTime?` fields for soft deletes if you need audit trails or data recovery capabilities.

### Validation Constraints

- Unique slug per team for projects
- Unique step numbers per test case
- Unique test case order per test suite
- One result per test case per test run

## Recommended Queries for Common Operations

### Dashboard Statistics

```typescript
// Get project summary with counts
const projectStats = await prisma.project.findMany({
  where: { teamId },
  include: {
    _count: {
      select: {
        testCases: true,
        testSuites: true
      }
    }
  }
});
```

### Test Execution

```typescript
// Get test run with all test cases and current results
const testRunWithResults = await prisma.testRun.findUnique({
  where: { id: testRunId },
  include: {
    testSuite: {
      include: {
        testSuiteItems: {
          include: {
            testCase: {
              include: {
                testSteps: { orderBy: { stepNumber: 'asc' } }
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    },
    testRunResults: true
  }
});
```

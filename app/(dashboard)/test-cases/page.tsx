import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, FileText, FolderOpen, Search } from 'lucide-react'
import { getTestCases } from '@/lib/actions/test-cases'
import { formatDistanceToNow } from 'date-fns'

function EmptyTestCasesState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Test Cases Yet</h3>
        <p className="text-muted-foreground text-center mb-6">
          Create your first test case to start building your test suite.
        </p>
        <div className="flex space-x-3">
          <Button asChild>
            <Link href="/test-cases/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Test Case
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/projects">
              <FolderOpen className="h-4 w-4 mr-2" />
              View Projects
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TestCaseCard({ testCase }: Readonly<{ testCase: any }>) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'warning' as const
      case 'medium': return 'secondary' as const
      case 'low': return 'outline' as const
      default: return 'secondary' as const
    }
  }

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <Link 
              href={`/test-cases/${testCase.id}`}
              className="text-lg font-semibold hover:text-blue-600 transition-colors block"
            >
              {testCase.title}
            </Link>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FolderOpen className="h-3 w-3" />
              <Link 
                href={`/projects/${testCase.project.id}`}
                className="hover:text-blue-600 transition-colors"
              >
                {testCase.project.name}
              </Link>
            </div>
          </div>
          <Badge variant={getPriorityColor(testCase.priority)}>
            {formatPriority(testCase.priority)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {testCase.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {testCase.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              {testCase.steps.length} step{testCase.steps.length === 1 ? '' : 's'}
            </span>
            <span className="text-muted-foreground">
              Created {formatDistanceToNow(new Date(testCase.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function TestCasesPage(
  { searchParams }: Readonly<{ searchParams: { project?: string; search?: string } }>
) {
  const { testCases, error } = await getTestCases(searchParams.project)

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Test Cases</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading test cases: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filter test cases based on search if provided
  const filteredTestCases = searchParams.search 
    ? testCases.filter(testCase => 
        testCase.title.toLowerCase().includes(searchParams.search!.toLowerCase()) ||
        testCase.description?.toLowerCase().includes(searchParams.search!.toLowerCase())
      )
    : testCases

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Cases</h1>
          <p className="text-muted-foreground">
            Manage and organize your test cases
          </p>
        </div>
        <Button asChild>
          <Link href="/test-cases/new">
            <Plus className="h-4 w-4 mr-2" />
            New Test Case
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search test cases..."
            className="pl-10"
            defaultValue={searchParams.search}
          />
        </div>
        {searchParams.project && (
          <Button variant="outline" asChild>
            <Link href="/test-cases">
              View All Projects
            </Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      {testCases.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                  <p className="text-xl font-semibold">{testCases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 rounded bg-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-xl font-semibold">
                    {testCases.filter(tc => tc.priority === 'critical').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 rounded bg-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">High</p>
                  <p className="text-xl font-semibold">
                    {testCases.filter(tc => tc.priority === 'high').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Projects</p>
                  <p className="text-xl font-semibold">
                    {new Set(testCases.map(tc => tc.project.id)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Cases Grid */}
      {filteredTestCases.length === 0 ? (
        <EmptyTestCasesState />
      ) : (
        <div className="grid gap-4">
          {filteredTestCases.map((testCase) => (
            <TestCaseCard key={testCase.id} testCase={testCase} />
          ))}
        </div>
      )}
    </div>
  )
}
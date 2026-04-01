import { z } from 'zod'

// Project validation schema
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  description: z.string().optional(),
  status: z.enum(['active', 'archived', 'on_hold'], {
    required_error: 'Status is required',
  }),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Test Case validation schema  
export const testCaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  preconditions: z.string().optional(),
  expectedResult: z.string().min(1, 'Expected result is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: 'Priority is required',
  }),
  status: z.enum(['draft', 'active', 'deprecated'], {
    required_error: 'Status is required', 
  }),
  module: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  projectId: z.string().cuid('Invalid project ID'),
})

export type TestCaseFormData = z.infer<typeof testCaseSchema>

// Test Step validation schema
export const testStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  action: z.string().min(1, 'Action is required'),
  expected: z.string().min(1, 'Expected result is required'),
  notes: z.string().optional(),
  testCaseId: z.string().cuid('Invalid test case ID').optional(),
})

export type TestStepFormData = z.infer<typeof testStepSchema>

// Test Suite validation schema
export const testSuiteSchema = z.object({
  name: z.string().min(1, 'Suite name is required').max(100, 'Suite name must be less than 100 characters'),
  description: z.string().optional(),
  projectId: z.string().cuid('Invalid project ID'),
})

export type TestSuiteFormData = z.infer<typeof testSuiteSchema>

// Test Run validation schema
export const testRunSchema = z.object({
  name: z.string().min(1, 'Run name is required').max(100, 'Run name must be less than 100 characters'),
  description: z.string().optional(),
  testSuiteId: z.string().cuid('Invalid test suite ID'),
})

export type TestRunFormData = z.infer<typeof testRunSchema>
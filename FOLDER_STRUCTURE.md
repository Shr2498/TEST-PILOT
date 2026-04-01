# TestPilot Folder Structure

## Complete Project Structure

```text
testpilot/
├── app/                          # Next.js App Router (main application)
│   ├── (auth)/                   # Route groups for auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Auth-specific layout
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── test-cases/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [testId]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── test-suites/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [suiteId]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── test-runs/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── [runId]/
│   │   │   │       │   ├── page.tsx
│   │   │   │       │   └── execute/
│   │   │   │       │       └── page.tsx
│   │   │   │       └── new/
│   │   │   │           └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   ├── team/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── test-cases/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── test-suites/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── test-runs/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── users/
│   │       └── route.ts
│   ├── globals.css               # Global styles (Tailwind imports)
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Global loading UI
│   ├── error.tsx                 # Global error UI
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Landing page
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── ...                   # Other shadcn components
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── auth/                     # Authentication components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── auth-guard.tsx
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── stats-card.tsx
│   │   ├── recent-activity.tsx
│   │   └── quick-actions.tsx
│   ├── projects/                 # Project-related components
│   │   ├── project-card.tsx
│   │   ├── project-form.tsx
│   │   ├── project-list.tsx
│   │   └── project-header.tsx
│   ├── test-cases/               # Test case components
│   │   ├── test-case-form.tsx
│   │   ├── test-case-list.tsx
│   │   ├── test-case-card.tsx
│   │   ├── test-case-filters.tsx
│   │   └── test-step-builder.tsx
│   ├── test-suites/              # Test suite components
│   │   ├── test-suite-form.tsx
│   │   ├── test-suite-list.tsx
│   │   └── test-suite-builder.tsx
│   ├── test-runs/                # Test run components
│   │   ├── test-run-form.tsx
│   │   ├── test-run-list.tsx
│   │   ├── test-execution.tsx
│   │   └── execution-results.tsx
│   ├── reports/                  # Reporting components
│   │   ├── charts/
│   │   │   ├── execution-chart.tsx
│   │   │   └── trends-chart.tsx
│   │   ├── report-filters.tsx
│   │   └── export-button.tsx
│   └── common/                   # Common reusable components
│       ├── search-input.tsx
│       ├── data-table.tsx
│       ├── pagination.tsx
│       ├── loading-spinner.tsx
│       ├── empty-state.tsx
│       ├── confirmation-dialog.tsx
│       └── theme-toggle.tsx
├── lib/                          # Utility functions and configurations
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client instance
│   ├── utils.ts                  # Utility functions (cn, etc.)
│   ├── validations/              # Zod schemas for validation
│   │   ├── auth.ts
│   │   ├── project.ts
│   │   ├── test-case.ts
│   │   ├── test-suite.ts
│   │   └── test-run.ts
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-projects.ts
│   │   ├── use-test-cases.ts
│   │   ├── use-test-runs.ts
│   │   └── use-debounce.ts
│   ├── services/                 # Data access layer
│   │   ├── projects.ts
│   │   ├── test-cases.ts
│   │   ├── test-suites.ts
│   │   ├── test-runs.ts
│   │   └── users.ts
│   └── constants.ts              # App constants
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                   # Database seeding
├── types/                        # TypeScript type definitions
│   ├── auth.ts                   # Authentication types
│   ├── project.ts                # Project-related types
│   ├── test-case.ts              # Test case types
│   ├── test-suite.ts             # Test suite types
│   ├── test-run.ts               # Test run types
│   ├── user.ts                   # User types
│   └── index.ts                  # Re-exports
├── public/                       # Static assets
│   ├── icons/
│   ├── images/
│   └── favicon.ico
├── .env.local                    # Environment variables
├── .env.example                  # Environment variables template
├── .gitignore
├── tailwind.config.js
├── components.json               # shadcn/ui config
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Folder Explanations

### `app/` - Next.js App Router

The heart of your application using Next.js 13+ App Router. Organized by features and route groups:

- `(auth)/` - Authentication pages (login, register)
- `(dashboard)/` - Protected dashboard routes with nested project features
- `api/` - API routes for backend functionality
- Uses layouts for consistent UI across route groups

### `components/` - Reusable UI Components

Feature-based component organization for maintainability:

- `ui/` - shadcn/ui base components
- Feature folders (`projects/`, `test-cases/`, etc.) - Domain-specific components
- `layout/` - Application shell components
- `common/` - Shared utility components

### `lib/` - Utility Functions & Configurations

Central location for non-UI logic:

- `services/` - Data access layer (database operations)
- `validations/` - Zod schemas for type-safe validation
- `hooks/` - Custom React hooks for state management
- Configuration files (auth, database, utils)

### `prisma/` - Database Layer

Database schema and migration management:

- `schema.prisma` - Database schema definition
- `migrations/` - Database version control
- `seed.ts` - Sample data for development

### `types/` - TypeScript Definitions

Centralized type definitions organized by domain:

- Feature-specific types (projects, test cases, etc.)
- Authentication and user types
- Shared interfaces and enums

## Key Benefits of This Structure

1. **Feature-Based Organization**: Related code is grouped together
2. **Scalable**: Easy to add new features without restructuring
3. **Clear Separation**: UI, business logic, and data layers are distinct
4. **Type Safety**: Comprehensive TypeScript coverage
5. **Maintainable**: Consistent patterns throughout the codebase
6. **Solo-Friendly**: Simple enough for one developer to navigate quickly

## Development Workflow

1. **Start with types**: Define interfaces in `types/`
2. **Create database schema**: Update `prisma/schema.prisma`
3. **Build services**: Implement data layer in `lib/services/`
4. **Add validation**: Create schemas in `lib/validations/`
5. **Create components**: Build UI in `components/`
6. **Wire up routes**: Connect everything in `app/`

This structure supports your MVP requirements while remaining extensible for future features.

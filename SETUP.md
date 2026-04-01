# TestPilot Development Setup

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your PostgreSQL connection string
# DATABASE_URL="postgresql://username:password@localhost:5432/testpilot?schema=public"
```

### 3. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations to create tables
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

## Database Commands

```bash
# View database in browser
npm run db:studio

# Reset database (careful - deletes all data!)
npm run db:reset

# Push schema changes without migrations
npm run db:push
```

## Sample Data Included

After running the seed script, you'll have:

- **1 Workspace**: "TestPilot Demo Workspace"
- **2 Users**:
  - Sarah Johnson (QA Manager) - `sarah.manager@testpilot.dev`
  - Mike Chen (QA Tester) - `mike.tester@testpilot.dev`
- **2 Projects**:
  - E-Commerce Platform (authentication, payments, search, cart)
  - Mobile Companion App (notifications, offline mode)
- **10 Test Cases**: Covering login, payments, search, mobile features, API handling
- **2 Test Suites**:
  - Smoke Test Suite (critical functionality)
  - Regression Test Suite (comprehensive testing)
- **1 Test Run**: Sample execution with mixed results (Pass/Fail/Blocked)
- **8 Tags**: smoke, regression, login, payments, api, ui, mobile, security

## UI Testing Scenarios

The seed data provides realistic scenarios for testing:

1. **Authentication Testing**: Valid/invalid login flows
2. **Payment Processing**: Success and failure cases
3. **Search & Cart**: E-commerce user flows  
4. **Mobile Features**: Push notifications and offline mode
5. **Error Handling**: API failures and network issues
6. **Test Execution**: View test runs with different result statuses

Perfect for building and testing TestPilot's core features!

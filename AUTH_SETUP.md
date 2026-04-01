# TestPilot Authentication Setup Guide

## 🔐 Complete Authentication System

This authentication system provides secure login/logout, user registration, session management, and route protection for your TestPilot MVP.

## 📁 Files Created

### Core Authentication
- `lib/auth.ts` - NextAuth configuration with credentials provider
- `lib/auth-utils.ts` - Server-side session utilities  
- `middleware.ts` - Route protection middleware
- `types/auth.ts` - TypeScript types for authentication

### API Routes
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- `app/api/auth/register/route.ts` - User registration endpoint

### Pages & Components
- `app/(auth)/layout.tsx` - Authentication page layout
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/register/page.tsx` - Registration page
- `components/auth/login-form.tsx` - Login form component
- `components/auth/register-form.tsx` - Registration form component
- `components/auth/logout-button.tsx` - Logout button component
- `components/auth/auth-provider.tsx` - Session provider wrapper

### Protected Dashboard
- `app/(dashboard)/layout.tsx` - Protected dashboard layout
- `app/(dashboard)/dashboard/page.tsx` - Dashboard page

### Validation
- `lib/validations/auth.ts` - Zod schemas for form validation

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install next-auth @next-auth/prisma-adapter bcryptjs @hookform/resolvers
npm install -D @types/bcryptjs
```

### 2. Environment Variables
Add to your `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/testpilot?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-32-characters-minimum
```

> **Important**: Generate a secure NEXTAUTH_SECRET:
> ```bash
> openssl rand -base64 32
> ```

### 3. Database Migration
The Prisma schema has been updated to include a `password` field:
```bash
# Generate Prisma client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Seed with demo users (includes hashed passwords)
npm run db:seed
```

### 4. Start Development
```bash
npm run dev
```

## 🧪 Testing Authentication

### Demo Credentials
- **Email**: sarah.manager@testpilot.dev
- **Password**: demo123

### User Registration
1. Visit `/register` to create new accounts
2. Users are automatically assigned to default team
3. Passwords are properly hashed with bcrypt

### Route Protection
Protected routes (configured in middleware.ts):
- `/dashboard/*` - Dashboard pages
- `/projects/*` - Project management
- `/reports/*` - Reports and analytics
- `/team/*` - Team management

## 🔒 Security Features

### Password Security
- Bcrypt hashing with salt rounds (12)
- Password validation (minimum 6 characters)
- Secure credential comparison

### Session Management
- JWT-based sessions for performance
- Session data includes user ID and team info
- Automatic session refresh

### Route Protection
- Middleware-based protection
- Server-side session validation
- Automatic redirect to login for unauthenticated users

### Error Handling
- Graceful error messages for invalid credentials
- Form validation with user-friendly feedback
- Proper HTTP status codes

## 🛠 Usage Examples

### Server-Side Authentication
```typescript
import { requireAuth, getCurrentUser } from '@/lib/auth-utils'

// Require authentication (redirect if not logged in)
const user = await requireAuth()

// Optional authentication check
const user = await getCurrentUser()
if (!user) {
  // Handle unauthenticated state
}
```

### Client-Side Authentication
```typescript
import { useSession, signOut } from 'next-auth/react'

function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <Loading />
  if (!session) return <LoginPrompt />
  
  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  )
}
```

### Logout Functionality
```typescript
import LogoutButton from '@/components/auth/logout-button'

// Simple logout button
<LogoutButton />

// Custom logout button
<LogoutButton variant="destructive" size="lg" />
```

## 🔄 Authentication Flow

1. **Landing Page** (`/`) - Shows welcome page or redirects to dashboard if authenticated
2. **Login** (`/login`) - Credential-based authentication with NextAuth
3. **Registration** (`/register`) - Creates new user account with team assignment  
4. **Dashboard** (`/dashboard`) - Protected route showing user info
5. **Logout** - Clears session and redirects to home page

## 📝 Next Steps

Now that authentication is set up, you can:

1. **Expand the dashboard layout** with navigation sidebar
2. **Add team management** features for collaboration
3. **Implement project CRUD** operations with user permissions
4. **Build test case management** with user assignments
5. **Add role-based access control** (Admin, Member, Viewer roles)

## 🚨 Important Notes

- The demo uses a simple credentials provider for MVP simplicity
- In production, consider adding OAuth providers (Google, GitHub)
- Implement proper password reset functionality
- Add email verification for new registrations
- Consider implementing role-based permissions

Your authentication system is now complete and ready for building the core TestPilot features!
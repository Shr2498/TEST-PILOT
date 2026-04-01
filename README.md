# TestPilot 🚀

**A Modern Test Management Platform Built with Next.js**

TestPilot is a comprehensive test management solution designed for development teams who need to organize, track, and execute their testing workflows efficiently. Built with modern web technologies and featuring a professional dark/light theme system.

![TestPilot Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)

## ✨ Key Features

### 🔐 **Authentication & Security**
- Secure user registration and login
- Session-based authentication with NextAuth.js
- Protected routes and middleware
- Role-based access patterns

### 📊 **Comprehensive Dashboard**
- Real-time project statistics
- Test execution metrics
- Visual progress tracking
- Customizable widgets

### 🧪 **Test Management**
- **Projects**: Organize tests by application or feature
- **Test Cases**: Create detailed test scenarios with steps
- **Test Suites**: Group related test cases
- **Test Runs**: Execute and track test results

### 📈 **Reporting & Analytics**
- Detailed test execution reports
- Progress tracking and metrics
- Export capabilities
- Historical data analysis

### 🎨 **Professional UI/UX**
- Modern SaaS-style interface
- Full dark/light mode support
- Responsive design for all devices
- Accessible components following WCAG guidelines

### ⚡ **Developer Experience**
- TypeScript for type safety
- Prisma for database management
- Server Actions for seamless data flow
- Comprehensive error handling

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 with App Router |
| **Language** | TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | NextAuth.js |
| **Styling** | Tailwind CSS |
| **UI Components** | Custom component library |
| **State Management** | React Server Components |
| **Deployment** | Vercel Ready |

## 📋 Prerequisites

Before running TestPilot, ensure you have:

- **Node.js** 18.x or later
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Shr2498/TEST-PILOT.git
cd TEST-PILOT
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/testpilot"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database (optional)
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see TestPilot in action! 🎉

## 📁 Project Structure

```
TestPilot/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── ui/                # Core UI library
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
│   ├── actions/           # Server actions
│   └── validations/       # Zod schemas
├── prisma/               # Database schema and migrations
└── types/                # TypeScript type definitions
```

## 🎯 Usage Guide

### Creating Your First Project
1. **Register/Login** at `/login`
2. **Navigate** to Projects from the sidebar
3. **Click** "Create New Project"
4. **Fill** in project details and save

### Managing Test Cases
1. **Select** a project from the Projects page
2. **Go** to Test Cases section
3. **Create** test cases with detailed steps
4. **Organize** them into test suites

### Running Tests
1. **Create** a test run from Test Runs page
2. **Select** test suites to include
3. **Execute** tests and record results
4. **View** reports and analytics

## 🎨 UI Components Library

TestPilot includes a comprehensive set of reusable components:

### Layout Components
- `PageHeader` - Consistent page headers with actions
- `Sidebar` - Navigation with role-based menu items
- `Header` - Top navigation with user menu

### Data Display
- `DataTable` - Advanced tables with sorting and pagination
- `StatCard` - Metrics display cards
- `StatusBadge` - Status indicators
- `PriorityBadge` - Priority level indicators

### Interactive Elements
- `SearchToolbar` - Advanced search and filtering
- `ConfirmDialog` - Modal confirmations
- `LoadingState` - Skeleton loading states
- `ErrorState` - Error handling with retry options
- `EmptyState` - Empty state messaging

### Theme System
- `ThemeProvider` - System-wide theme management
- `ThemeToggle` - Dark/light mode switcher

## 🔒 Security Features

- **CSRF Protection** via NextAuth.js
- **SQL Injection Prevention** with Prisma
- **XSS Protection** with CSP headers
- **Secure Headers** configured in middleware
- **Input Validation** with Zod schemas
- **Rate Limiting** on API endpoints

## 📱 Responsive Design

TestPilot works seamlessly across all devices:
- **Desktop** - Full-featured interface
- **Tablet** - Touch-optimized navigation
- **Mobile** - Responsive layouts with drawer navigation

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker
```bash
# Build image
docker build -t testpilot .

# Run container
docker run -p 3000:3000 testpilot
```

### Environment Variables for Production
Ensure these are set in your deployment platform:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for deployment platform
- **Tailwind CSS** for styling system
- **Prisma** for database tooling

## 📞 Support

Need help? Here are your options:

- 📖 **Documentation**: Check the `/docs` folder
- 🐛 **Issue Tracker**: [GitHub Issues](https://github.com/Shr2498/TEST-PILOT/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Shr2498/TEST-PILOT/discussions)

---

**Built with ❤️ by the TestPilot Team**

*Making test management simple, efficient, and enjoyable.*
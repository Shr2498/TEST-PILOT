import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a sample workspace
  const workspace = await prisma.team.create({
    data: {
      name: 'TestPilot Demo Workspace',
      slug: 'testpilot-demo',
      description: 'Demo workspace for TestPilot showcasing QA management capabilities'
    }
  })

  // Hash demo passwords
  const hashedPassword = await bcrypt.hash('demo123', 12)

  // Create users
  const qaManager = await prisma.user.create({
    data: {
      email: 'sarah.manager@testpilot.dev',
      name: 'Sarah Johnson',
      avatar: 'https://avatar.vercel.sh/sarah',
      password: hashedPassword,
      teamId: workspace.id
    }
  })

  await prisma.user.create({
    data: {
      email: 'mike.tester@testpilot.dev',
      name: 'Mike Chen',
      avatar: 'https://avatar.vercel.sh/mike',
      password: hashedPassword,
      teamId: workspace.id
    }
  })

  // Create tags for better organization
  await Promise.all([
    prisma.tag.create({ data: { name: 'smoke', color: '#F59E0B' } }),
    prisma.tag.create({ data: { name: 'regression', color: '#8B5CF6' } }),
    prisma.tag.create({ data: { name: 'login', color: '#EF4444' } }),
    prisma.tag.create({ data: { name: 'payments', color: '#10B981' } }),
    prisma.tag.create({ data: { name: 'api', color: '#3B82F6' } })
  ])

  // Create projects
  await prisma.project.create({
    data: {
      name: 'E-Commerce Platform',
      slug: 'ecommerce',
      description: 'Online shopping platform with payment processing and user management',
      teamId: workspace.id,
      ownerId: qaManager.id
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📧 Demo accounts:')
  console.log('   Manager: sarah.manager@testpilot.dev / demo123')
  console.log('   Tester: mike.tester@testpilot.dev / demo123')
}

async function runSeed() {
  try {
    await main()
    console.log('✅ Database seeded successfully!')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runSeed()

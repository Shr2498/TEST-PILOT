import { User } from '@prisma/client'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      teamId: string
      teamName: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    teamId: string
    teamName: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    teamId: string
    teamName: string
  }
}

export interface AuthUser extends User {
  teamId: string
}
import { Suspense } from 'react'
import LoginForm from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

export const metadata = {
  title: 'Login | TestPilot',
  description: 'Sign in to your TestPilot account',
}
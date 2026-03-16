import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | PO Dads',
  description: 'Sign in to PO Dads to access the community features.',
}

interface Props {
  searchParams: Promise<{ redirectTo?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirectTo = '/' } = await searchParams

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🌿</span>
          <h1 className="text-2xl font-black text-gray-900">Welcome to PO Dads</h1>
          <p className="text-gray-500 text-sm mt-2">
            Hampshire's community for dads & toddlers
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 text-center mb-5">Sign in or create an account</h2>
          <LoginForm redirectTo={redirectTo} />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to be a decent human being to other dads. 🤝
        </p>
      </div>
    </div>
  )
}

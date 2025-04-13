'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TEXT } from '@/lib/constants/text'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 验证表单
    if (!email.trim()) {
      setError(TEXT.auth.emailRequired)
      return
    }
    if (!password.trim()) {
      setError(TEXT.auth.passwordRequired)
      return
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        // 调试用
        alert(`错误类型: ${authError.name}\n错误信息: ${authError.message}\n错误详情: ${JSON.stringify(authError, null, 2)}`)
        
        if (authError.message.includes('Email not confirmed')) {
          setError(TEXT.auth.emailNotConfirmed)
        } else if (authError.message.includes('Invalid login credentials')) {
          setError(TEXT.auth.invalidCredentials)
        } else {
          setError(TEXT.auth.loginError)
        }
        return
      }
      router.push('/dashboard')
    } catch (error) {
      console.error('登录错误:', error)
      setError(TEXT.auth.loginError)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            <Button variant="ghost" size="sm" className="gap-2">
              <span>←</span> {TEXT.common.backToHome}
            </Button>
          </Link>
        </div>
        <h2 className="text-center text-3xl font-bold">{TEXT.auth.login}</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder={TEXT.auth.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder={TEXT.auth.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" className="w-full">
            {TEXT.auth.loginButton}
          </Button>
        </form>
        <p className="text-center text-sm">
          {TEXT.auth.noAccount}{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            {TEXT.auth.registerLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
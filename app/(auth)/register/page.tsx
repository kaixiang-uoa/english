'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TEXT } from '@/lib/constants/text'
import { checkPasswordStrength } from '@/lib/utils/password'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    const { message } = checkPasswordStrength(value)
    setPasswordMessage(message)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 表单验证
    if (!email.trim()) {
      setError(TEXT.auth.emailRequired)
      return
    }
    if (!validateEmail(email)) {
      setError(TEXT.auth.invalidEmail)
      return
    }
    if (!password.trim()) {
      setError(TEXT.auth.passwordRequired)
      return
    }
    if (!confirmPassword.trim()) {
      setError(TEXT.auth.confirmPasswordRequired)
      return
    }
    if (password !== confirmPassword) {
      setError(TEXT.auth.passwordMismatch)
      return
    }

    // 密码强度验证
    const { isStrong, message } = checkPasswordStrength(password)
    if (!isStrong) {
      setError(message)
      return
    }

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (authError) {
        if (authError.message.includes('rate limit')) {
          setError(TEXT.auth.rateLimitExceeded)
        } else if (authError.message.includes('already registered')) {
          setError(TEXT.auth.emailAlreadyRegistered)
        } else {
          setError(TEXT.auth.registrationFailed)
        }
        return
      }
      router.push('/login')
    } catch (error) {
      console.error('捕获到的错误:', error)
      setError(TEXT.auth.registrationFailed)
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
        <h2 className="text-center text-3xl font-bold">{TEXT.auth.register}</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="email"
            placeholder={TEXT.auth.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="space-y-1">
            <Input
              type="password"
              placeholder={TEXT.auth.password}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {passwordMessage && (
              <p className={`text-sm ${password && checkPasswordStrength(password).isStrong ? 'text-green-600' : 'text-red-600'}`}>
                {passwordMessage}
              </p>
            )}
          </div>
          <Input
            type="password"
            placeholder={TEXT.auth.confirmPassword}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" className="w-full">
            {TEXT.auth.registerButton}
          </Button>
        </form>
        <p className="text-center text-sm">
          {TEXT.auth.hasAccount}{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            {TEXT.auth.loginLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
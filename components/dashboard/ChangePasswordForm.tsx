'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { TEXT } from '@/lib/constants/text'

interface ChangePasswordFormProps {
  userEmail: string;
}

export default function ChangePasswordForm({ userEmail }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    
    // 验证新密码格式
    if (newPassword.length < 6) {
      setError(TEXT.auth.passwordTooShort)
      return
    }

    // 验证两次密码输入是否一致
    if (newPassword !== confirmPassword) {
      setError(TEXT.auth.passwordMismatch)
      return
    }

    setLoading(true)
    try {
      // 先验证当前密码
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,  // 使用传入的用户邮箱
        password: currentPassword,
      })
      
      if (signInError) {
        setError(TEXT.dashboard.settings.account.currentPasswordError)
        return
      }

      // 更新密码
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        setError(TEXT.dashboard.settings.account.updatePasswordError)
        return
      }

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setError(TEXT.dashboard.settings.account.updatePasswordError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {TEXT.dashboard.settings.account.currentPassword}
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          {TEXT.dashboard.settings.account.newPassword}
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {TEXT.dashboard.settings.account.confirmNewPassword}
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600">{TEXT.dashboard.settings.account.passwordUpdateSuccess}</p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? TEXT.common.processing : TEXT.dashboard.settings.account.changePassword}
      </Button>
    </form>
  )
}
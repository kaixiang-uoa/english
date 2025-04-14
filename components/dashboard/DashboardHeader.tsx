// components/dashboard/DashboardHeader.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function DashboardHeader() {
  const [userName, setUserName] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('')
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserName(user.email.split('@')[0])
      }
    }
    getUser()

    const hour = new Date().getHours()
    if (hour < 12) {
      setTimeOfDay('morning')
      setGreeting('早上好 | Good morning')
    }
    else if (hour < 18) {
      setTimeOfDay('afternoon')
      setGreeting('下午好 | Good afternoon')
    }
    else {
      setTimeOfDay('evening')
      setGreeting('晚上好 | Good evening')
    }
  }, [])

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>返回主页 | Back to Home</span>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">
        {greeting}, {userName}!
      </h1>
      <p className="mt-2 text-gray-600">
        跟踪您的学习进度，继续您的学习之旅。 | Track your progress and continue your learning journey.
      </p>
    </div>
  )
}
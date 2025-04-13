// components/dashboard/DashboardHeader.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function DashboardHeader() {
  const [userName, setUserName] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserName(user.email.split('@')[0])
      }
    }
    getUser()

    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 18) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')
  }, [])

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Good {timeOfDay}, {userName}!
      </h1>
      <p className="mt-2 text-gray-600">
        Track your progress and continue your learning journey.
      </p>
    </div>
  )
}
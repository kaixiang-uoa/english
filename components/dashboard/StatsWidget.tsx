// components/dashboard/StatsWidget.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function StatsWidget() {
  const [stats, setStats] = useState({
    totalWords: 0,
    streak: 0,
    todayLearned: 0
  })

  useEffect(() => {
    // Mock data - replace with actual data fetching
    setStats({
      totalWords: 150,
      streak: 5,
      todayLearned: 12
    })
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Total Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.totalWords}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Study Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.streak} days</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.todayLearned} words</div>
        </CardContent>
      </Card>
    </div>
  )
}
// components/dashboard/RecentActivityWidget.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { fetchRecentActivity } from "@/lib/services/words"

interface Activity {
  id: string // 修改为string因为Supabase使用UUID
  type: string
  word: string
  timestamp: string
}

export default function RecentActivityWidget() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecentActivity() {
      try {
        setIsLoading(true)
        const activityData = await fetchRecentActivity()
        setActivities(activityData)
      } catch (err) {
        console.error("Failed to load recent activity data", err)
        setError("无法加载最近活动")
      } finally {
        setIsLoading(false)
      }
    }

    loadRecentActivity()
  }, [])

  // 加载状态
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>最近活动 | Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <p>加载中...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 错误状态
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>最近活动 | Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 无数据状态
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>最近活动 | Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <p>开始学习单词，您的活动将在这里显示！</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近活动 | Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 space-y-4 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'learned' ? 'bg-blue-500' :
                activity.type === 'reviewed' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.word}</p>
                <p className="text-xs text-gray-500">{activity.type}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
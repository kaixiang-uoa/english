// components/dashboard/StatsWidget.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { fetchUserStats } from "@/lib/services/words"

interface Stats {
  totalWords: number
  streak: number
  todayLearned: number
}

export default function StatsWidget() {
  const [stats, setStats] = useState<Stats>({
    totalWords: 0,
    streak: 0,
    todayLearned: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserStats() {
      try {
        setIsLoading(true)
        const statsData = await fetchUserStats()
        if (statsData) {
          setStats(statsData)
        } else {
          setError("无法加载统计数据")
        }
      } catch (err) {
        console.error("Failed to load user stats", err)
        setError("加载统计数据时出错")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserStats()
  }, [])

  // 加载状态
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['总单词数 | Total Words', '学习连续天数 | Study Streak', '今日进度 | Today\'s Progress'].map((title, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-10 flex items-center">
                <p>加载中...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['总单词数 | Total Words', '学习连续天数 | Study Streak', '今日进度 | Today\'s Progress'].map((title, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-10 flex items-center">
                <p className="text-red-500">{error}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">总单词数 | Total Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.totalWords}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">学习连续天数 | Study Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.streak} 天 | days</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">今日进度 | Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.todayLearned} 个单词 | words</div>
        </CardContent>
      </Card>
    </div>
  )
}
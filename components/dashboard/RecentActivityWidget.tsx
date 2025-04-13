// components/dashboard/RecentActivityWidget.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Activity {
  id: number
  type: string
  word: string
  timestamp: string
}

export default function RecentActivityWidget() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Mock data - replace with actual data fetching
    setActivities([
      { id: 1, type: 'learned', word: 'Ephemeral', timestamp: '2 hours ago' },
      { id: 2, type: 'reviewed', word: 'Ubiquitous', timestamp: '4 hours ago' },
      { id: 3, type: 'mastered', word: 'Serendipity', timestamp: '1 day ago' },
    ])
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
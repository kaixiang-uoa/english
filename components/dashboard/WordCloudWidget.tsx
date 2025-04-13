// components/dashboard/WordCloudWidget.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function WordCloudWidget() {
  const [words, setWords] = useState<{text: string, value: number}[]>([])

  useEffect(() => {
    // Mock data - replace with actual data fetching
    setWords([
      { text: 'vocabulary', value: 30 },
      { text: 'learning', value: 25 },
      { text: 'English', value: 20 },
      { text: 'practice', value: 15 },
      { text: 'study', value: 10 },
    ])
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Cloud</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex flex-wrap items-center justify-center gap-4">
          {words.map((word, index) => (
            <span
              key={index}
              className="inline-block transition-transform hover:scale-110"
              style={{
                fontSize: `${word.value / 2}px`,
                color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
              }}
            >
              {word.text}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
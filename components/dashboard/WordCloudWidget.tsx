// components/dashboard/WordCloudWidget.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { fetchUserWordCloudData } from "@/lib/services/wordcloud"

export default function WordCloudWidget() {
  const [words, setWords] = useState<{text: string, value: number}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadWordCloudData() {
      try {
        setIsLoading(true)
        const wordData = await fetchUserWordCloudData()
        setWords(wordData)
      } catch (err) {
        console.error("Failed to load word cloud data", err)
        setError("无法加载您的词云数据")
      } finally {
        setIsLoading(false)
      }
    }

    loadWordCloudData()
  }, [])

  // 加载状态
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>词云 | Word Cloud</CardTitle>
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
          <CardTitle>词云 | Word Cloud</CardTitle>
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
  if (words.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>词云 | Word Cloud</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <p>开始学习新单词，观察您的词云成长！</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 词云展示
  return (
    <Card>
      <CardHeader>
        <CardTitle>词云 | Word Cloud</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex flex-wrap items-center justify-center gap-4">
          {words.map((word, index) => (
            <span
              key={index}
              className="inline-block transition-transform hover:scale-110"
              style={{
                fontSize: `${Math.min(40, word.value)}px`, // 限制最大字体大小
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
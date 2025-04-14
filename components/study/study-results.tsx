"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, BarChart3, BookOpen, RefreshCw } from "lucide-react"
import type { Word } from "@/lib/types/word"

interface StudyResultsProps {
  results: {
    correct: number
    incorrect: number
    skipped: number
    reviewWords: Word[]
  }
  totalWords: number
  onReviewMissed: () => void
  onNewSession: () => void
}

export function StudyResults({ results, totalWords, onReviewMissed, onNewSession }: StudyResultsProps) {
  const correctPercentage = Math.round((results.correct / totalWords) * 100) || 0
  const incorrectPercentage = Math.round((results.incorrect / totalWords) * 100) || 0
  const skippedPercentage = Math.round((results.skipped / totalWords) * 100) || 0

  const getPerformanceMessage = () => {
    if (correctPercentage >= 90) return "太棒了！你的表现非常出色！"
    if (correctPercentage >= 70) return "做得好！继续保持！"
    if (correctPercentage >= 50) return "不错的尝试！再接再厉！"
    return "继续努力，你会进步的！"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Award className="mr-2 h-5 w-5 text-yellow-500" />
            学习结果
          </CardTitle>
          <CardDescription>您已完成本次学习，以下是您的表现</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold">{getPerformanceMessage()}</h3>
            <p className="text-gray-500 mt-1">
              您学习了 {totalWords} 个单词，正确率 {correctPercentage}%
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-green-600">{results.correct}</div>
              <div className="text-sm text-gray-500">正确</div>
              <div className="text-xs">{correctPercentage}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-red-600">{results.incorrect}</div>
              <div className="text-sm text-gray-500">错误</div>
              <div className="text-xs">{incorrectPercentage}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-500">{results.skipped}</div>
              <div className="text-sm text-gray-500">跳过</div>
              <div className="text-xs">{skippedPercentage}%</div>
            </div>
          </div>

          <div className="relative pt-1">
            <div className="flex h-4 overflow-hidden rounded-full text-xs">
              <div
                style={{ width: `${correctPercentage}%` }}
                className="flex flex-col justify-center bg-green-500 text-center text-white shadow-none"
              ></div>
              <div
                style={{ width: `${incorrectPercentage}%` }}
                className="flex flex-col justify-center bg-red-500 text-center text-white shadow-none"
              ></div>
              <div
                style={{ width: `${skippedPercentage}%` }}
                className="flex flex-col justify-center bg-gray-300 text-center text-white shadow-none"
              ></div>
            </div>
          </div>

          {results.reviewWords.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">需要复习的单词 ({results.reviewWords.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {results.reviewWords.slice(0, 6).map((word) => (
                  <div key={word.id} className="border rounded-md p-2 text-sm">
                    <div className="font-medium">{word.term}</div>
                    <div className="text-gray-500 truncate">{word.definition}</div>
                  </div>
                ))}
                {results.reviewWords.length > 6 && (
                  <div className="border rounded-md p-2 text-sm flex items-center justify-center text-gray-500">
                    +{results.reviewWords.length - 6} 个单词
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={onNewSession}>
            <RefreshCw className="mr-2 h-4 w-4" />
            新的学习
          </Button>
          {results.reviewWords.length > 0 && (
            <Button className="w-full sm:w-auto" onClick={onReviewMissed}>
              <BookOpen className="mr-2 h-4 w-4" />
              复习错误的单词
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
            学习建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>根据您的学习情况，我们有以下建议：</p>
            <ul className="list-disc pl-5 space-y-1">
              {results.incorrect > 0 && <li>定期复习您不熟悉的 {results.incorrect} 个单词</li>}
              {correctPercentage < 70 && <li>尝试减少每次学习的单词数量，专注于更少的单词</li>}
              {correctPercentage >= 90 && <li>您已经掌握了这些单词，可以尝试学习更多新单词</li>}
              <li>每天坚持学习，效果会更好</li>
              <li>尝试不同的学习模式，找到最适合您的方式</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

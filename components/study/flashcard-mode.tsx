"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, FlipVerticalIcon as Flip, X } from "lucide-react"
import type { Word } from "@/lib/types/word"

interface FlashcardModeProps {
  words: Word[]
  onComplete: (results: { correct: number; incorrect: number; skipped: number; reviewWords: Word[] }) => void
}

export function FlashcardMode({ words, onComplete }: FlashcardModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [results, setResults] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    reviewWords: [] as Word[],
  })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(((currentIndex + 1) / words.length) * 100)
  }, [currentIndex, words.length])

  const handleFlip = () => {
    setShowDefinition(!showDefinition)
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowDefinition(false)
    } else {
      onComplete(results)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowDefinition(false)
    }
  }

  const handleResult = (result: "correct" | "incorrect" | "skipped") => {
    const newResults = { ...results }

    if (result === "correct") {
      newResults.correct += 1
    } else if (result === "incorrect") {
      newResults.incorrect += 1
      newResults.reviewWords.push(words[currentIndex])
    } else {
      newResults.skipped += 1
      newResults.reviewWords.push(words[currentIndex])
    }

    setResults(newResults)
    handleNext()
  }

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">没有可学习的单词</h3>
        <p className="text-gray-500 mt-2">请调整学习设置或添加更多单词</p>
        <Button className="mt-4" onClick={() => onComplete(results)}>
          返回设置
        </Button>
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {words.length}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-green-600">正确: {results.correct}</span>
          <span className="text-sm text-red-600">错误: {results.incorrect}</span>
          <span className="text-sm text-gray-500">跳过: {results.skipped}</span>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex justify-center">
        <Card className="w-full max-w-2xl min-h-[300px] cursor-pointer" onClick={handleFlip}>
          <CardHeader className="text-center">
            <div className="text-sm text-gray-500">{showDefinition ? "定义" : "单词"} (点击卡片翻转)</div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              {showDefinition ? (
                <div className="space-y-4">
                  <p className="text-xl">{currentWord.definition}</p>
                  {currentWord.example && (
                    <div className="mt-4 text-gray-600 text-sm italic">
                      <p>例句: {currentWord.example}</p>
                    </div>
                  )}
                </div>
              ) : (
                <h2 className="text-3xl font-bold">{currentWord.term}</h2>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleFlip()
              }}
            >
              <Flip className="h-4 w-4 mr-2" />
              翻转
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          上一个
        </Button>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => handleResult("incorrect")}
          >
            <X className="h-4 w-4 mr-2" />
            不认识
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
            onClick={() => handleResult("skipped")}
          >
            跳过
          </Button>
          <Button
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
            onClick={() => handleResult("correct")}
          >
            <Check className="h-4 w-4 mr-2" />
            认识
          </Button>
        </div>

        <Button variant="outline" onClick={handleNext}>
          下一个
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

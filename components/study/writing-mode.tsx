"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import type { Word } from "@/lib/types/word"

interface WritingModeProps {
  words: Word[]
  onComplete: (results: { correct: number; incorrect: number; skipped: number; reviewWords: Word[] }) => void
}

export function WritingMode({ words, onComplete }: WritingModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAnswered) {
      handleNext()
      return
    }

    const currentWord = words[currentIndex]
    // Case insensitive comparison
    const normalizedInput = userInput.trim().toLowerCase()
    const normalizedTerm = currentWord.term.toLowerCase()

    const correct = normalizedInput === normalizedTerm
    setIsCorrect(correct)
    setIsAnswered(true)

    const newResults = { ...results }
    if (correct) {
      newResults.correct += 1
    } else {
      newResults.incorrect += 1
      newResults.reviewWords.push(currentWord)
    }

    setResults(newResults)
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserInput("")
      setIsAnswered(false)
    } else {
      onComplete(results)
    }
  }

  const handleSkip = () => {
    const newResults = { ...results }
    newResults.skipped += 1
    newResults.reviewWords.push(words[currentIndex])
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

      <Card className="w-full">
        <CardHeader>
          <CardTitle>根据定义拼写单词：</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg">{currentWord.definition}</p>
            {currentWord.example && (
              <div className="text-gray-600 text-sm italic">
                <p>例句: {currentWord.example.replace(new RegExp(currentWord.term, "gi"), "______")}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="输入单词..."
                  value={userInput}
                  onChange={handleInputChange}
                  disabled={isAnswered}
                  className={
                    isAnswered
                      ? isCorrect
                        ? "border-green-500 focus-visible:ring-green-500"
                        : "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />

                {isAnswered && (
                  <div className={isCorrect ? "text-green-600" : "text-red-600"}>
                    {isCorrect ? (
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <span>正确!</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="mr-2 h-4 w-4" />
                        <span>
                          正确答案: <span className="font-medium">{currentWord.term}</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSkip} disabled={isAnswered}>
            跳过
          </Button>
          <Button onClick={handleSubmit}>
            {isAnswered ? (currentIndex < words.length - 1 ? "下一题" : "完成") : "提交"}
            {isAnswered && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

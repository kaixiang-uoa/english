"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import type { Word } from "@/lib/types/word"

interface QuizModeProps {
  words: Word[]
  onComplete: (results: { correct: number; incorrect: number; skipped: number; reviewWords: Word[] }) => void
}

export function QuizMode({ words, onComplete }: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const [results, setResults] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    reviewWords: [] as Word[],
  })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (words.length > 0) {
      generateOptions()
      setProgress(((currentIndex + 1) / words.length) * 100)
    }
  }, [currentIndex, words.length])

  const generateOptions = () => {
    const currentWord = words[currentIndex]
    const correctAnswer = currentWord.term

    // Get 3 random words different from the current one
    const otherWords = words
      .filter((word) => word.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((word) => word.term)

    // Combine correct answer with distractors and shuffle
    const allOptions = [correctAnswer, ...otherWords]
    setOptions(shuffleArray(allOptions))
  }

  const shuffleArray = (array: string[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleAnswer = () => {
    if (!selectedAnswer) return

    setIsAnswered(true)
    const currentWord = words[currentIndex]
    const isCorrect = selectedAnswer === currentWord.term

    const newResults = { ...results }
    if (isCorrect) {
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
      setSelectedAnswer(null)
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
          <CardTitle>选择与以下定义匹配的单词：</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg">{currentWord.definition}</p>
            {currentWord.example && (
              <div className="text-gray-600 text-sm italic">
                <p>例句: {currentWord.example}</p>
              </div>
            )}

            <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={option}
                    disabled={isAnswered}
                    className={
                      isAnswered
                        ? option === currentWord.term
                          ? "text-green-600 border-green-600"
                          : option === selectedAnswer
                            ? "text-red-600 border-red-600"
                            : ""
                        : ""
                    }
                  />
                  <Label
                    htmlFor={option}
                    className={
                      isAnswered
                        ? option === currentWord.term
                          ? "text-green-600 font-medium"
                          : option === selectedAnswer && option !== currentWord.term
                            ? "text-red-600"
                            : ""
                        : ""
                    }
                  >
                    {option}
                    {isAnswered && option === currentWord.term && (
                      <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600" />
                    )}
                    {isAnswered && option === selectedAnswer && option !== currentWord.term && (
                      <XCircle className="inline-block ml-2 h-4 w-4 text-red-600" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSkip} disabled={isAnswered}>
            跳过
          </Button>
          <div className="space-x-2">
            {!isAnswered ? (
              <Button onClick={handleAnswer} disabled={!selectedAnswer}>
                提交答案
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentIndex < words.length - 1 ? "下一题" : "完成"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

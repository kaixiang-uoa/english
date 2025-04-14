"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, BrainCircuit, PenLine } from "lucide-react"

interface StudyModeSelectorProps {
  selectedMode: "flashcard" | "quiz" | "writing"
  onSelectMode: (mode: "flashcard" | "quiz" | "writing") => void
}

export function StudyModeSelector({ selectedMode, onSelectMode }: StudyModeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">选择学习模式</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            selectedMode === "flashcard"
              ? "border-blue-500 ring-2 ring-blue-200"
              : "hover:border-blue-200 hover:shadow-md"
          }`}
          onClick={() => onSelectMode("flashcard")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
              闪卡模式
            </CardTitle>
            <CardDescription>通过翻卡片记忆单词</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">查看单词和定义，自我评估您的记忆程度。适合初步记忆和快速复习。</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedMode === "quiz" ? "border-blue-500 ring-2 ring-blue-200" : "hover:border-blue-200 hover:shadow-md"
          }`}
          onClick={() => onSelectMode("quiz")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BrainCircuit className="mr-2 h-5 w-5 text-blue-600" />
              测验模式
            </CardTitle>
            <CardDescription>多选题测试您的记忆</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              从多个选项中选择正确答案，测试您对单词的理解。适合巩固记忆和检验学习效果。
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedMode === "writing"
              ? "border-blue-500 ring-2 ring-blue-200"
              : "hover:border-blue-200 hover:shadow-md"
          }`}
          onClick={() => onSelectMode("writing")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <PenLine className="mr-2 h-5 w-5 text-blue-600" />
              拼写模式
            </CardTitle>
            <CardDescription>输入单词进行拼写练习</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              根据定义输入正确的单词拼写，锻炼您的拼写能力。适合深度记忆和掌握单词拼写。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

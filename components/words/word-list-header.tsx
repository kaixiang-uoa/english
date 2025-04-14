"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface WordListHeaderProps {
  totalWords: number
  filteredWords: number
  onAddWord: () => void
}

export function WordListHeader({ totalWords, filteredWords, onAddWord }: WordListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">单词列表</h1>
        <p className="text-gray-500 mt-1">
          {filteredWords === totalWords ? `共 ${totalWords} 个单词` : `显示 ${filteredWords}/${totalWords} 个单词`}
        </p>
      </div>
      <Button onClick={onAddWord} className="mt-4 md:mt-0">
        <PlusCircle className="mr-2 h-4 w-4" />
        添加单词
      </Button>
    </div>
  )
}

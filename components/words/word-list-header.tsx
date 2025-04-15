"use client"

import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"

interface WordListHeaderProps {
  totalWords: number
  filteredWords: number
  onAddWord: () => void
  onImportWords: () => void
}

export function WordListHeader({ totalWords, filteredWords, onAddWord, onImportWords }: WordListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">单词管理</h1>
        <p className="text-gray-500 dark:text-gray-400">
          共 {totalWords} 个单词{filteredWords !== totalWords && `，当前显示 ${filteredWords} 个`}
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onImportWords} variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          批量导入
        </Button>
        <Button onClick={onAddWord} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          添加单词
        </Button>
      </div>
    </div>
  )
}

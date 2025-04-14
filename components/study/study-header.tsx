import { BookOpen } from "lucide-react"

interface StudyHeaderProps {
  totalWords: number
}

export function StudyHeader({ totalWords }: StudyHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">开始学习</h1>
        <p className="text-gray-500 mt-1">您的词库中有 {totalWords} 个单词，选择学习模式开始提高您的词汇量</p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
        <BookOpen className="mr-2 h-5 w-5" />
        <span className="font-medium">学习使您更强大</span>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload } from "lucide-react"
import type { Word } from "@/lib/types/word"

interface ImportWordsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportWords: (words: Omit<Word, "id" | "created_at" | "user_id">[]) => Promise<void>
  isSubmitting?: boolean
}

export function ImportWordsDialog({ 
  open, 
  onOpenChange, 
  onImportWords, 
  isSubmitting = false 
}: ImportWordsDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    setPreviewData(null)
    
    if (!selectedFile) {
      setFile(null)
      return
    }

    if (selectedFile.type !== "application/json") {
      setError("请选择JSON格式的文件")
      setFile(null)
      return
    }

    setFile(selectedFile)
    
    // 读取文件预览
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (!Array.isArray(json)) {
          setError("文件格式错误：JSON必须是单词数组")
          return
        }
        
        // 验证数据格式
        const isValid = json.every(item => 
          typeof item === 'object' && 
          item !== null && 
          typeof item.term === 'string'
        )
        
        if (!isValid) {
          setError("文件格式错误：每个单词必须至少包含term字段")
          return
        }
        
        setPreviewData(json.slice(0, 5)) // 只预览前5个
      } catch (err) {
        setError("无法解析JSON文件")
      }
    }
    reader.readAsText(selectedFile)
  }

  const handleImport = async () => {
    if (!file) return
    
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string)
          
          // 转换为Word格式
          const words = json.map((item: any) => ({
            term: item.term,
            definition: item.definition || "",
            example: item.example || "",
            category_id: item.category_id || "",
            difficulty: item.difficulty || 3,
            notes: item.notes || "",
            phonetic_us: item.phonetic_us || "",
            phonetic_uk: item.phonetic_uk || "",
            pos: item.pos || "",
            word_id: item.word_id || "",
            reviewed: false,
            review_count: 0,
            last_review_at: null,
          }))
          
          await onImportWords(words)
          setFile(null)
          setPreviewData(null)
        } catch (err) {
          setError("导入过程中发生错误")
        }
      }
      reader.readAsText(file)
    } catch (err) {
      setError("读取文件时发生错误")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>批量导入单词</DialogTitle>
          <DialogDescription>
            通过JSON文件批量导入单词到您的词汇库
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="json-file" className="text-sm font-medium">
              选择JSON文件
            </label>
            <Input
              id="json-file"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              JSON文件应包含单词数组，每个单词至少需要term字段
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewData && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">数据预览（前5项）：</h3>
              <div className="max-h-40 overflow-y-auto rounded border p-2 text-xs">
                <pre>{JSON.stringify(previewData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            取消
          </Button>
          <Button 
            type="button" 
            onClick={handleImport} 
            disabled={!file || isSubmitting}
          >
            {isSubmitting ? "导入中..." : "导入"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
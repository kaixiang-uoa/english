"use client"

import { useState } from "react"
import { Edit, Trash2, MoreHorizontal, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { EditWordDialog } from "./edit-word-dialog"
import type { Word, Category } from "@/lib/types/word"

interface WordListTableProps {
  words: Word[]
  categories: Category[]
  onDelete: (id: string) => void
  onUpdate: (word: Word) => void
}

export function WordListTable({ words, categories, onDelete, onUpdate }: WordListTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [wordToDelete, setWordToDelete] = useState<Word | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [wordToEdit, setWordToEdit] = useState<Word | null>(null)

  const handleDeleteClick = (word: Word) => {
    setWordToDelete(word)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (wordToDelete) {
      onDelete(wordToDelete.id)
      setDeleteDialogOpen(false)
      setWordToDelete(null)
    }
  }

  const handleEditClick = (word: Word) => {
    setWordToEdit(word)
    setEditDialogOpen(true)
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "未分类"
  }

  const getDifficultyBadge = (difficulty: number) => {
    if (difficulty <= 2) {
      return (
        <Badge variant="outline" className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
          简单
        </Badge>
      )
    } else if (difficulty <= 4) {
      return (
        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
          中等
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700">
          困难
        </Badge>
      )
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "从未"
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">单词</TableHead>
                <TableHead className="hidden md:table-cell">定义</TableHead>
                <TableHead className="hidden md:table-cell">分类</TableHead>
                <TableHead className="hidden md:table-cell">难度</TableHead>
                <TableHead className="hidden md:table-cell">上次学习</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {words.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    没有找到单词，请尝试调整筛选条件或添加新单词
                  </TableCell>
                </TableRow>
              ) : (
                words.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell className="font-medium text-gray-900 dark:text-white">{word.term}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate text-gray-800 dark:text-gray-300">{word.definition}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-700 dark:text-gray-300">{getCategoryName(word.category_id)}</TableCell>
                    <TableCell className="hidden md:table-cell">{getDifficultyBadge(word.difficulty)}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-700 dark:text-gray-300">{formatDate(word.last_review_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(word)}>
                          <Edit className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(word)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>编辑</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                onUpdate({
                                  ...word,
                                  last_review_at: new Date().toISOString(),
                                })
                              }}
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              <span>标记为已学习</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(word)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>删除</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              您确定要删除单词 "<span className="font-semibold text-black dark:text-white">{wordToDelete?.term}</span>" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Word Dialog */}
      {wordToEdit && (
        <EditWordDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          word={wordToEdit}
          categories={categories}
          onSave={onUpdate}
        />
      )}
    </>
  )
}

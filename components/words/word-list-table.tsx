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
                <TableHead>单词</TableHead>
                <TableHead>音标</TableHead>
                <TableHead>词性</TableHead>
                <TableHead>释义</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>难度</TableHead>
                <TableHead>上次复习</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {words.map((word) => (
                <TableRow key={word.id}>
                  <TableCell className="font-medium">{word.term}</TableCell>
                  <TableCell>
                    {word.phonetic_us && <span>美 [{word.phonetic_us}]</span>}
                    {word.phonetic_uk && word.phonetic_us && <span className="mx-1">|</span>}
                    {word.phonetic_uk && <span>英 [{word.phonetic_uk}]</span>}
                  </TableCell>
                  <TableCell>{word.pos}</TableCell>
                  <TableCell>{word.definition}</TableCell>
                  <TableCell>{word.category_id ? getCategoryName(word.category_id) : "未分类"}</TableCell>
                  <TableCell>{getDifficultyBadge(word.difficulty)}</TableCell>
                  <TableCell>{formatDate(word.last_review_at || null)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">打开菜单</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(word)}>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(word)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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

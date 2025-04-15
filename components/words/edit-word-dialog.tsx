"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Category, Word } from "@/lib/types/word"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  // 现有字段
  term: z.string().min(1, "单词不能为空"),
  definition: z.string().min(1, "定义不能为空"),
  example: z.string().optional(),
  category_id: z.string().min(1, "请选择分类"),
  difficulty: z.number().min(1).max(5),
  notes: z.string().optional(),
  // 新增字段
  phonetic_us: z.string().optional(),
  phonetic_uk: z.string().optional(),
  pos: z.string().optional(),
  word_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>

interface EditWordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  word: Word
  categories: Category[]
  onSave: (word: Word) => void
}

export function EditWordDialog({ open, onOpenChange, word, categories, onSave }: EditWordDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: word.term,
      definition: word.definition,
      example: word.example || "",
      category_id: word.category_id,
      difficulty: word.difficulty,
      notes: word.notes || "",
      // 添加新字段的默认值
      phonetic_us: word.phonetic_us || "",
      phonetic_uk: word.phonetic_uk || "",
      pos: word.pos || "",
      word_id: word.word_id || "",
    },
  })

  // Update form when word changes
  useEffect(() => {
    form.reset({
      term: word.term,
      definition: word.definition,
      example: word.example || "",
      category_id: word.category_id,
      difficulty: word.difficulty,
      notes: word.notes || "",
      // 添加新字段的重置值
      phonetic_us: word.phonetic_us || "",
      phonetic_uk: word.phonetic_uk || "",
      pos: word.pos || "",
      word_id: word.word_id || "",
    })
  }, [word, form])

  const onSubmit = (values: FormValues) => {
    onSave({
      ...word,
      ...values,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>编辑单词</DialogTitle>
          <DialogDescription>修改单词信息</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>单词</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 添加新字段 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phonetic_us"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>美式音标</FormLabel>
                    <FormControl>
                      <Input placeholder="美式音标..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phonetic_uk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>英式音标</FormLabel>
                    <FormControl>
                      <Input placeholder="英式音标..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>词性</FormLabel>
                  <FormControl>
                    <Input placeholder="例如: n. / v. / adj. / adv." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="definition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>定义</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>例句 (可选)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分类</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>难度级别 ({field.value})</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      defaultValue={[field.value]}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormDescription>1 = 非常简单, 5 = 非常困难</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>笔记 (可选)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

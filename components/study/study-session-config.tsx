"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayCircle, Settings2 } from "lucide-react"
import type { Category } from "@/lib/types/word"

interface StudySessionConfigProps {
  config: {
    wordCount: number
    categories: string[]
    difficulty: [number, number]
    includeNew: boolean
    includeReview: boolean
  }
  setConfig: (config: any) => void
  categories: Category[]
  totalWords: number
  onStartStudy: () => void
}

export function StudySessionConfig({
  config,
  setConfig,
  categories,
  totalWords,
  onStartStudy,
}: StudySessionConfigProps) {
  const [activeTab, setActiveTab] = useState<string>("basic")

  const handleCategoryToggle = (categoryId: string) => {
    setConfig({
      ...config,
      categories: config.categories.includes(categoryId)
        ? config.categories.filter((id) => id !== categoryId)
        : [...config.categories, categoryId],
    })
  }

  const maxWordCount = Math.min(totalWords, 50)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Settings2 className="mr-2 h-5 w-5 text-blue-600" />
          学习设置
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">基本设置</TabsTrigger>
            <TabsTrigger value="advanced">高级设置</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="word-count">单词数量: {config.wordCount}</Label>
                <span className="text-sm text-gray-500">最大: {maxWordCount}</span>
              </div>
              <Slider
                id="word-count"
                min={5}
                max={maxWordCount}
                step={5}
                value={[config.wordCount]}
                onValueChange={(value) => setConfig({ ...config, wordCount: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <Label>学习内容</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-new"
                    checked={config.includeNew}
                    onCheckedChange={(checked) => setConfig({ ...config, includeNew: !!checked })}
                  />
                  <label
                    htmlFor="include-new"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    包含新单词
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-review"
                    checked={config.includeReview}
                    onCheckedChange={(checked) => setConfig({ ...config, includeReview: !!checked })}
                  />
                  <label
                    htmlFor="include-review"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    包含需要复习的单词
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>
                难度范围: {config.difficulty[0]} - {config.difficulty[1]}
              </Label>
              <Slider
                min={1}
                max={5}
                step={1}
                value={config.difficulty}
                onValueChange={(value) => setConfig({ ...config, difficulty: value as [number, number] })}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>简单</span>
                <span>困难</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>选择分类</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={config.categories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
              {config.categories.length > 0 && (
                <p className="text-xs text-gray-500">已选择 {config.categories.length} 个分类</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={onStartStudy} className="w-full">
          <PlayCircle className="mr-2 h-5 w-5" />
          开始学习
        </Button>
      </CardFooter>
    </Card>
  )
}

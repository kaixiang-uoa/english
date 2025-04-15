"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Category } from "@/lib/types/word"

const POS_OPTIONS = [
  { value: "all", label: "全部词性" },
  { value: "n", label: "名词 (n.)" },
  { value: "v", label: "动词 (v.)" },
  { value: "adj", label: "形容词 (adj.)" },
  { value: "adv", label: "副词 (adv.)" },
  { value: "prep", label: "介词 (prep.)" },
  { value: "conj", label: "连词 (conj.)" },
  { value: "pron", label: "代词 (pron.)" },
  { value: "art", label: "冠词 (art.)" },
  { value: "int", label: "感叹词 (int.)" },
]

interface WordListFiltersProps {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: "alphabetical" | "studyTime" | "difficulty"
  setSortBy: (sort: "alphabetical" | "studyTime" | "difficulty") => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  selectedPos: string
  setSelectedPos: (pos: string) => void
}

export function WordListFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  selectedPos,
  setSelectedPos,
}: WordListFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const getCurrentSortValue = () => {
    if (sortBy === "alphabetical" && sortOrder === "asc") return "alphabetical-asc"
    if (sortBy === "alphabetical" && sortOrder === "desc") return "alphabetical-desc"
    if (sortBy === "studyTime" && sortOrder === "asc") return "studyTime-asc"
    if (sortBy === "studyTime" && sortOrder === "desc") return "studyTime-desc"
    if (sortBy === "difficulty" && sortOrder === "asc") return "difficulty-asc"
    if (sortBy === "difficulty" && sortOrder === "desc") return "difficulty-desc"
    return "alphabetical-asc"
  }

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-") as [typeof sortBy, typeof sortOrder]
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }

  // Desktop filters
  const DesktopFilters = (
    <div className="hidden md:flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索单词或定义..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">所有分类</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedPos} onValueChange={setSelectedPos}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="选择词性" />
        </SelectTrigger>
        <SelectContent>
          {POS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={getCurrentSortValue()} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="排序方式" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alphabetical-asc">按字母 (A-Z)</SelectItem>
          <SelectItem value="alphabetical-desc">按字母 (Z-A)</SelectItem>
          <SelectItem value="studyTime-asc">最早学习</SelectItem>
          <SelectItem value="studyTime-desc">最近学习</SelectItem>
          <SelectItem value="difficulty-asc">难度 (低-高)</SelectItem>
          <SelectItem value="difficulty-desc">难度 (高-低)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  // Sheet content component
  const SheetFilterContent = () => (
    <>
      <SheetHeader>
        <SheetTitle>筛选与排序</SheetTitle>
        <SheetDescription>选择分类和排序方式</SheetDescription>
      </SheetHeader>
      <div className="py-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">分类</h3>
          <Select
            value={selectedCategory}
            onValueChange={(value: string) => {
              setSelectedCategory(value)
              setMobileFiltersOpen(false)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分类</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">词性</h3>
          <Select
            value={selectedPos}
            onValueChange={(value: string) => {
              setSelectedPos(value)
              setMobileFiltersOpen(false)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择词性" />
            </SelectTrigger>
            <SelectContent>
              {POS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">排序方式</h3>
          <Select
            value={getCurrentSortValue()}
            onValueChange={(value: string) => {
              handleSortChange(value)
              setMobileFiltersOpen(false)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical-asc">按字母 (A-Z)</SelectItem>
              <SelectItem value="alphabetical-desc">按字母 (Z-A)</SelectItem>
              <SelectItem value="studyTime-asc">最早学习</SelectItem>
              <SelectItem value="studyTime-desc">最近学习</SelectItem>
              <SelectItem value="difficulty-asc">难度 (低-高)</SelectItem>
              <SelectItem value="difficulty-desc">难度 (高-低)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  return (
    <div className="space-y-4">
      {DesktopFilters}
      
      {/* Mobile filters */}
      <div className="md:hidden">
        <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索单词或定义..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetFilterContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        {/* 分类选择 */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">所有</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* 词性选择 */}
        <Tabs defaultValue="all" value={selectedPos} onValueChange={setSelectedPos}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {POS_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value}>
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

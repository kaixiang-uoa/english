"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Category } from "@/lib/types/word"

// 新增组件来处理Sheet内容
function SheetFilterContent({
  categories,
  selectedCategory,
  setSelectedCategory,
  getCurrentSortValue,
  handleSortChange,
  setMobileFiltersOpen,
}: {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  getCurrentSortValue: () => string
  handleSortChange: (value: string) => void
  setMobileFiltersOpen: (open: boolean) => void
}) {
  return (
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
}

interface WordListFiltersProps {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: "alphabetical" | "studyTime" | "difficulty"
  setSortBy: (sortBy: "alphabetical" | "studyTime" | "difficulty") => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
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
}: WordListFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleSortChange = (value: string) => {
    if (value === "alphabetical-asc") {
      setSortBy("alphabetical")
      setSortOrder("asc")
    } else if (value === "alphabetical-desc") {
      setSortBy("alphabetical")
      setSortOrder("desc")
    } else if (value === "studyTime-asc") {
      setSortBy("studyTime")
      setSortOrder("asc")
    } else if (value === "studyTime-desc") {
      setSortBy("studyTime")
      setSortOrder("desc")
    } else if (value === "difficulty-asc") {
      setSortBy("difficulty")
      setSortOrder("asc")
    } else if (value === "difficulty-desc") {
      setSortBy("difficulty")
      setSortOrder("desc")
    }
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

  // Mobile filters
  const MobileFilters = (
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
            <SheetFilterContent 
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              getCurrentSortValue={getCurrentSortValue}
              handleSortChange={handleSortChange}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {DesktopFilters}
      {MobileFilters}

      <div className="bg-white p-4 rounded-lg shadow-sm">
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
      </div>
    </div>
  )
}

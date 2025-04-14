"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import { WordListHeader } from "@/components/words/word-list-header";
import { WordListFilters } from "@/components/words/word-list-filters";
import { WordListTable } from "@/components/words/word-list-table";
import { AddWordDialog } from "@/components/words/add-word-dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import type { Word, Category } from "@/lib/types/word";

export default function WordListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "alphabetical" | "studyTime" | "difficulty"
  >("alphabetical");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // Fetch words and categories
      await Promise.all([fetchWords(), fetchCategories()]);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("words")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching words:", error);
        return;
      }

      setWords(data || []);
      setFilteredWords(data || []);
    } catch (error) {
      console.error("Unexpected error fetching words:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }

    // 如果用户没有分类，创建默认分类
    if (data && data.length === 0) {
      await createDefaultCategoriesForUser();
      // 重新获取分类
      const { data: newData } = await supabase.from("categories").select("*");
      setCategories(newData || []);
    } else {
      setCategories(data || []);
    }
  };

  // 创建默认分类函数
  const createDefaultCategoriesForUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const defaultCategories = [
      { name: "学习", user_id: user.id },
      { name: "工作", user_id: user.id },
      { name: "日常生活", user_id: user.id },
      { name: "食物", user_id: user.id },
      { name: "娱乐", user_id: user.id },
      { name: "旅行", user_id: user.id },
      { name: "其他", user_id: user.id },
    ];

    const { error } = await supabase
      .from("categories")
      .insert(defaultCategories);

    if (error) console.error("Error creating default categories:", error);
  };

  useEffect(() => {
    // Apply filters and sorting whenever dependencies change
    let result = [...words];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (word) =>
          word.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.definition.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((word) => word.category_id === selectedCategory);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "alphabetical") {
        return sortOrder === "asc"
          ? a.term.localeCompare(b.term)
          : b.term.localeCompare(a.term);
      } else if (sortBy === "studyTime") {
        return sortOrder === "asc"
          ? new Date(a.last_review_at || 0).getTime() - new Date(b.last_review_at || 0).getTime()
          : new Date(b.last_review_at || 0).getTime() - new Date(a.last_review_at || 0).getTime()
      } else {
        // Sort by difficulty
        return sortOrder === "asc"
          ? a.difficulty - b.difficulty
          : b.difficulty - a.difficulty;
      }
    });

    setFilteredWords(result);
  }, [words, searchQuery, selectedCategory, sortBy, sortOrder]);

  const handleAddWord = async (newWord: Omit<Word, "id" | "created_at" | "user_id">) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting word data:", newWord);
      
      // 获取当前用户ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        toast.error("添加失败：未找到用户信息");
        return;
      }
      
      // 添加user_id字段
      const wordWithUserId = {
        ...newWord,
        user_id: user.id
      };
      
      const { data, error } = await supabase.from("words").insert([wordWithUserId]).select();

      if (error) {
        console.error("Error adding word:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        toast.error(`添加失败：${error.message}`);
        return;
      }

      // Refresh the word list
      await fetchWords();
      setIsAddWordOpen(false);
      toast.success(`成功添加单词：${newWord.term}`);
    } catch (error) {
      console.error("Unexpected error adding word:", error);
      toast.error("添加单词时发生错误");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 检查用户是否拥有该单词
  const checkUserOwnsWord = async (wordId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      // 获取单词信息并验证所有权
      const { data, error } = await supabase
        .from("words")
        .select("user_id")
        .eq("id", wordId)
        .single();
      
      if (error || !data) {
        return false;
      }
      
      // 验证所有权
      return data.user_id === user.id;
    } catch (error) {
      return false;
    }
  };

  const handleDeleteWord = async (id: string) => {
    try {
      const wordToDelete = words.find(word => word.id === id);
      if (!wordToDelete) {
        toast.error("删除失败：找不到单词");
        return;
      }
      
      // 验证用户是否拥有该单词
      const hasOwnership = await checkUserOwnsWord(id);
      if (!hasOwnership) {
        toast.error("删除失败：您没有权限删除此单词");
        return;
      }
      
      // 删除记录
      const { error } = await supabase
        .from("words")
        .delete()
        .eq("id", id)
        .eq("user_id", wordToDelete.user_id);
        
      if (error) {
        toast.error(`删除失败：${error.message}`);
        return;
      }
      
      // 更新本地状态
      const updatedWords = words.filter((word) => word.id !== id);
      setWords(updatedWords);
      setFilteredWords(filteredWords.filter((word) => word.id !== id));
      
      toast.success(`成功删除单词：${wordToDelete.term}`);
    } catch (error) {
      toast.error("删除单词时发生错误");
    }
  };

  const handleUpdateWord = async (updatedWord: Word) => {
    try {
      const { error } = await supabase
        .from("words")
        .update(updatedWord)
        .eq("id", updatedWord.id);

      if (error) {
        console.error("Error updating word:", error);
        toast.error(`更新失败：${error.message}`);
        return;
      }

      // Update local state
      setWords(
        words.map((word) => (word.id === updatedWord.id ? updatedWord : word))
      );
      toast.success(`成功更新单词：${updatedWord.term}`);
    } catch (error) {
      console.error("Unexpected error updating word:", error);
      toast.error("更新单词时发生错误");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            <WordListHeader
              totalWords={words.length}
              filteredWords={filteredWords.length}
              onAddWord={() => setIsAddWordOpen(true)}
            />

            <div className="space-y-6">
              <WordListFilters
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />

              <WordListTable
                words={filteredWords}
                categories={categories}
                onDelete={handleDeleteWord}
                onUpdate={handleUpdateWord}
              />
            </div>
          </div>
        </main>
      </div>

      <AddWordDialog
        open={isAddWordOpen}
        onOpenChange={setIsAddWordOpen}
        categories={categories}
        onAddWord={handleAddWord}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

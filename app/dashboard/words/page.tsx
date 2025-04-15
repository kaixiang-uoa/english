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
import { ImportWordsDialog } from "@/components/words/import-words-dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import type { Word, Category } from "@/lib/types/word";
import { Pagination } from "@/components/ui/pagination";

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
  const [isImportWordsOpen, setIsImportWordsOpen] = useState(false);
  // 添加分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPos, setSelectedPos] = useState<string>("all");

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
      // 构建基础查询 - 先调用 select
      let query = supabase
        .from("words")
        .select(`
          *,
          categories:category_id (
            id,
            name,
            color
          )
        `);

      // 添加筛选条件
      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }
      if (selectedPos !== "all") {
        query = query.eq("pos", selectedPos);
      }
      if (searchQuery) {
        query = query.or(`term.ilike.%${searchQuery}%,definition.ilike.%${searchQuery}%`);
      }

      // 获取总数 (使用单独的查询)
      const countQuery = supabase
        .from("words")
        .select("*", { count: "exact" });
      
      // 添加相同的筛选条件到计数查询
      if (selectedCategory !== "all") {
        countQuery.eq("category_id", selectedCategory);
      }
      if (selectedPos !== "all") {
        countQuery.eq("pos", selectedPos);
      }
      if (searchQuery) {
        countQuery.or(`term.ilike.%${searchQuery}%,definition.ilike.%${searchQuery}%`);
      }
      
      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error("Error fetching count:", countError);
        return;
      }

      setTotalCount(count || 0);

      // 添加分页
      const { data, error } = await query
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching words:", error);
        return;
      }

      // 只在前端处理排序
      let sortedData = [...(data || [])];
      sortedData.sort((a, b) => {
        if (sortBy === "alphabetical") {
          return sortOrder === "asc"
            ? a.term.localeCompare(b.term)
            : b.term.localeCompare(a.term);
        } else if (sortBy === "studyTime") {
          return sortOrder === "asc"
            ? new Date(a.last_review_at || 0).getTime() -
                new Date(b.last_review_at || 0).getTime()
            : new Date(b.last_review_at || 0).getTime() -
                new Date(a.last_review_at || 0).getTime();
        } else {
          return sortOrder === "asc"
            ? a.difficulty - b.difficulty
            : b.difficulty - a.difficulty;
        }
      });

      setWords(sortedData);
      setFilteredWords(sortedData);
    } catch (error) {
      console.error("Unexpected error fetching words:", error);
    } finally {
      setLoading(false);
    }
  };

  // 翻页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 修改每页条数
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 切换每页数量时通常重置到第1页
  };

  // 翻页
  useEffect(() => {
    fetchWords();
  }, [currentPage, pageSize]);
  
  // 搜索
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }

    console.log("Fetched categories:", data); // 添加日志

    // 如果用户没有分类或只有"其他"分类，更新为新的分类列表
    if (!data || data.length <= 1) {
      await createDefaultCategoriesForUser();
      // 重新获取分类
      const { data: newData } = await supabase.from("categories").select("*");
      console.log("New categories after creation:", newData); // 添加日志
      setCategories(newData || []);
    } else {
      // 检查是否需要更新分类
      const hasAllCategories = defaultCategoryNames.every(name =>
        data.some(category => category.name === name)
      );
      
      if (!hasAllCategories) {
        await updateUserCategories(data);
        // 重新获取更新后的分类
        const { data: updatedData } = await supabase.from("categories").select("*");
        console.log("Updated categories:", updatedData); // 添加日志
        setCategories(updatedData || []);
      } else {
        setCategories(data || []);
      }
    }
  };

  // 默认分类名称列表
  const defaultCategoryNames = [
    "学习", "工作", "食物", "旅游", "娱乐", "健康", "家庭", 
    "自然", "科技", "商业", "法律", "建筑", "交通", "情绪", 
    "文化", "其他"
  ];

  // 更新用户分类的函数
  const updateUserCategories = async (existingCategories: Category[]) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 找出缺少的分类
    const missingCategories = defaultCategoryNames.filter(
      name => !existingCategories.some(category => category.name === name)
    ).map(name => ({
      name,
      user_id: user.id,
      type: "custom"
    }));

    if (missingCategories.length > 0) {
      const { error } = await supabase
        .from("categories")
        .insert(missingCategories);

      if (error) {
        console.error("Error updating categories:", error);
        toast.error("更新分类失败");
      } else {
        toast.success("分类已更新");
      }
    }
  };

  // 创建默认分类函数
  const createDefaultCategoriesForUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const defaultCategories = [
      { name: "学习", user_id: user.id, type: "custom" },
      { name: "工作", user_id: user.id, type: "custom" },
      { name: "食物", user_id: user.id, type: "custom" },
      { name: "旅游", user_id: user.id, type: "custom" },
      { name: "娱乐", user_id: user.id, type: "custom" },
      { name: "健康", user_id: user.id, type: "custom" },
      { name: "家庭", user_id: user.id, type: "custom" },
      { name: "自然", user_id: user.id, type: "custom" },
      { name: "科技", user_id: user.id, type: "custom" },
      { name: "商业", user_id: user.id, type: "custom" },
      { name: "法律", user_id: user.id, type: "custom" },
      { name: "建筑", user_id: user.id, type: "custom" },
      { name: "交通", user_id: user.id, type: "custom" },
      { name: "情绪", user_id: user.id, type: "custom" },
      { name: "文化", user_id: user.id, type: "custom" },
      { name: "其他", user_id: user.id, type: "custom" },
    ];

    const { error } = await supabase
      .from("categories")
      .insert(defaultCategories);

    if (error) console.error("Error creating default categories:", error);
  };

  useEffect(() => {
    // Apply filters and sorting whenever dependencies change
    // 监听筛选条件变化
    useEffect(() => {
      fetchWords();
    }, [currentPage, pageSize, selectedCategory, selectedPos, searchQuery]);
    
    // 移除原有的前端筛选逻辑，只保留排序
    useEffect(() => {
      let result = [...words];
      
      // 只处理排序
      result.sort((a, b) => {
        if (sortBy === "alphabetical") {
          return sortOrder === "asc"
            ? a.term.localeCompare(b.term)
            : b.term.localeCompare(a.term);
        } else if (sortBy === "studyTime") {
          return sortOrder === "asc"
            ? new Date(a.last_review_at || 0).getTime() -
                new Date(b.last_review_at || 0).getTime()
            : new Date(b.last_review_at || 0).getTime() -
                new Date(a.last_review_at || 0).getTime();
        } else {
          return sortOrder === "asc"
            ? a.difficulty - b.difficulty
            : b.difficulty - a.difficulty;
        }
      });
    
      setFilteredWords(result);
    }, [words, sortBy, sortOrder]);
  }, [words, searchQuery, selectedCategory, selectedPos, sortBy, sortOrder]);

  const handleAddWord = async (
    newWord: Omit<Word, "id" | "created_at" | "user_id">
  ) => {
    setIsSubmitting(true);
    try {
      console.log("Adding word with category:", newWord.category_id); // 添加日志

      // 获取当前用户ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        toast.error("添加失败：未找到用户信息");
        return;
      }

      // 添加user_id字段
      const wordWithUserId = {
        ...newWord,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("words")
        .insert([wordWithUserId])
        .select();

      if (error) {
        console.error("Error adding word:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        toast.error(`添加失败：${error.message}`);
        return;
      }

      console.log("Added word:", data); // 添加日志

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
      const wordToDelete = words.find((word) => word.id === id);
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

  // 添加批量导入处理函数
  const handleImportWords = async (
    wordsToImport: Omit<Word, "id" | "created_at" | "user_id">[]
  ) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        toast.error("导入失败：未找到用户信息");
        return;
      }

      // 验证必填字段并设置默认值
      const wordsWithUserId = wordsToImport.map((word) => {
        if (!word.term || !word.definition || !word.category_id) {
          throw new Error(`单词 "${word.term || "未知"}" 缺少必填字段`);
        }

        if (
          typeof word.difficulty !== "number" ||
          word.difficulty < 1 ||
          word.difficulty > 5
        ) {
          throw new Error(`单词 "${word.term}" 的难度级别无效`);
        }

        return {
          ...word,
          user_id: user.id,
          // 确保必填字段有默认值
          reviewed: word.reviewed ?? false,
          review_count: word.review_count ?? 0,
          // 可选字段的默认值
          example: word.example || null,
          notes: word.notes || null,
          last_review_at: word.last_review_at || null,
          phonetic_us: word.phonetic_us || null,
          phonetic_uk: word.phonetic_uk || null,
          pos: word.pos || null,
          word_id: word.word_id || null,
          extra_json: word.extra_json || null,
        };
      });

      const { data, error } = await supabase
        .from("words")
        .insert(wordsWithUserId)
        .select();

      if (error) {
        console.error("Error importing words:", error);
        toast.error(`导入失败：${error.message}`);
        return;
      }

      // 刷新单词列表
      await fetchWords();
      setIsImportWordsOpen(false);
      toast.success(`成功导入 ${wordsToImport.length} 个单词`);
    } catch (error) {
      console.error("Unexpected error importing words:", error);
      if (error instanceof Error) {
        toast.error(`导入失败：${error.message}`);
      } else {
        toast.error("导入单词时发生错误");
      }
    } finally {
      setIsSubmitting(false);
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
              totalWords={totalCount}
              filteredWords={filteredWords.length}
              onAddWord={() => setIsAddWordOpen(true)}
              onImportWords={() => setIsImportWordsOpen(true)}
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
                selectedPos={selectedPos}
                setSelectedPos={setSelectedPos}
              />

              <WordListTable
                words={filteredWords}
                categories={categories}
                onDelete={handleDeleteWord}
                onUpdate={handleUpdateWord}
              />

              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
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

      <ImportWordsDialog
        open={isImportWordsOpen}
        onOpenChange={setIsImportWordsOpen}
        onImportWords={handleImportWords}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import Navbar from "@/components/dashboard/Navbar"
import Sidebar from "@/components/dashboard/Sidebar"
import Breadcrumbs from "@/components/dashboard/Breadcrumbs"
import { StudyHeader } from "@/components/study/study-header"
import { StudyModeSelector } from "@/components/study/study-mode-selector"
import { StudySessionConfig } from "@/components/study/study-session-config"
import { FlashcardMode } from "@/components/study/flashcard-mode"
import { QuizMode } from "@/components/study/quiz-mode"
import { WritingMode } from "@/components/study/writing-mode"
import { StudyResults } from "@/components/study/study-results"
import LoadingSpinner from "@/components/ui/loading-spinner"
import type { Word, Category } from "@/lib/types/word"

type StudyMode = "flashcard" | "quiz" | "writing"
type StudyStatus = "config" | "studying" | "results"

export default function StudyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState<Word[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [studyWords, setStudyWords] = useState<Word[]>([])
  const [selectedMode, setSelectedMode] = useState<StudyMode>("flashcard")
  const [studyStatus, setStudyStatus] = useState<StudyStatus>("config")
  const [sessionConfig, setSessionConfig] = useState({
    wordCount: 10,
    categories: [] as string[],
    difficulty: [1, 5] as [number, number],
    includeNew: true,
    includeReview: true,
  })
  const [studyResults, setStudyResults] = useState<{
    correct: number
    incorrect: number
    skipped: number
    reviewWords: Word[]
  }>({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    reviewWords: [],
  })

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }

      // Fetch words and categories
      await Promise.all([fetchWords(), fetchCategories()])
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const fetchWords = async () => {
    const { data, error } = await supabase.from("words").select("*")

    if (error) {
      console.error("Error fetching words:", error)
      return
    }

    setWords(data || [])
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*")

    if (error) {
      console.error("Error fetching categories:", error)
      return
    }

    setCategories(data || [])
  }

  const startStudySession = () => {
    // Filter words based on session configuration
    let filteredWords = [...words]

    // Filter by categories if any are selected
    if (sessionConfig.categories.length > 0) {
      filteredWords = filteredWords.filter((word) => sessionConfig.categories.includes(word.category_id))
    }

    // Filter by difficulty
    filteredWords = filteredWords.filter(
      (word) => word.difficulty >= sessionConfig.difficulty[0] && word.difficulty <= sessionConfig.difficulty[1]
    )

    // Sort words by priority (new words first, then words that need review)
    filteredWords.sort((a, b) => {
      // If includeNew is true, prioritize words that have never been studied
      if (sessionConfig.includeNew) {
        if (!a.last_review_at && b.last_review_at) return -1
        if (a.last_review_at && !b.last_review_at) return 1
      }

      // If includeReview is true, prioritize words that were studied longer ago
      if (sessionConfig.includeReview) {
        if (a.last_review_at && b.last_review_at) {
          return new Date(a.last_review_at).getTime() - new Date(b.last_review_at).getTime()
        }
      }

      return 0
    })

    // Limit to the configured word count
    filteredWords = filteredWords.slice(0, sessionConfig.wordCount)

    // Shuffle the words for better learning
    filteredWords = shuffleArray(filteredWords)

    setStudyWords(filteredWords)
    setStudyStatus("studying")
    setStudyResults({
      correct: 0,
      incorrect: 0,
      skipped: 0,
      reviewWords: [],
    })
  }

  const shuffleArray = (array: any[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleStudyComplete = (results: {
    correct: number
    incorrect: number
    skipped: number
    reviewWords: Word[]
  }) => {
    setStudyResults(results)
    setStudyStatus("results")

    // Update last_review_at timestamp for all studied words
    const updatePromises = studyWords.map((word) => {
      return supabase
        .from("words")
        .update({ last_review_at: new Date().toISOString() })
        .eq("id", word.id)
    })

    Promise.all(updatePromises).catch((error) => {
      console.error("Error updating last_review_at timestamps:", error)
    })
  }

  const resetStudy = () => {
    setStudyStatus("config")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            <StudyHeader totalWords={words.length} />

            {studyStatus === "config" && (
              <div className="space-y-6">
                <StudyModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />
                <StudySessionConfig
                  config={sessionConfig}
                  setConfig={setSessionConfig}
                  categories={categories}
                  totalWords={words.length}
                  onStartStudy={startStudySession}
                />
              </div>
            )}

            {studyStatus === "studying" && selectedMode === "flashcard" && (
              <FlashcardMode words={studyWords} onComplete={handleStudyComplete} />
            )}

            {studyStatus === "studying" && selectedMode === "quiz" && (
              <QuizMode words={studyWords} onComplete={handleStudyComplete} />
            )}

            {studyStatus === "studying" && selectedMode === "writing" && (
              <WritingMode words={studyWords} onComplete={handleStudyComplete} />
            )}

            {studyStatus === "results" && (
              <StudyResults
                results={studyResults}
                totalWords={studyWords.length}
                onReviewMissed={() => {
                  setStudyWords(studyResults.reviewWords)
                  setStudyStatus("studying")
                }}
                onNewSession={resetStudy}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

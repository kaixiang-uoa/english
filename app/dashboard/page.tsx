// app/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Navbar from '@/components/dashboard/Navbar'
import Sidebar from '@/components/dashboard/Sidebar'
import Breadcrumbs from '@/components/dashboard/Breadcrumbs'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsWidget from '@/components/dashboard/StatsWidget'
import RecentActivityWidget from '@/components/dashboard/RecentActivityWidget'
import WordCloudWidget from '@/components/dashboard/WordCloudWidget'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

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
            <DashboardHeader />
            <div className="space-y-6">
              <StatsWidget />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecentActivityWidget />
                <WordCloudWidget />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { TEXT } from '@/lib/constants/text'
import { useEffect, useState } from 'react'

export default function Sidebar() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
      }
    }
    getUserEmail()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          <Link 
            href="/dashboard" 
            className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
          >
            {TEXT.dashboard.overview}
          </Link>
          <Link 
            href="/dashboard/words" 
            className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
          >
            {TEXT.dashboard.wordList}
          </Link>
          <Link 
            href="/dashboard/study" 
            className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
          >
            {TEXT.dashboard.study}
          </Link>
        </nav>
      </div>

      {/* 用户信息和设置区域 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {userEmail ? userEmail[0].toUpperCase() : '用户'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">{userEmail}</p>
          </div>
        </div>
        <div className="space-y-1">
          <Link 
            href="/dashboard/settings" 
            className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors text-sm"
          >
            {TEXT.dashboard.settings.title}
          </Link>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm"
          >
            {TEXT.auth.logout}
          </Button>
        </div>
      </div>
    </aside>
  )
}
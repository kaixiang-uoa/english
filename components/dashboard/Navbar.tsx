'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { TEXT } from '@/lib/constants/text'

export default function Navbar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {TEXT.dashboard.title}
            </h1>
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              {TEXT.auth.logout}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
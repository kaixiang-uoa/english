import Image from "next/image"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TEXT } from '@/lib/constants/text'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center">
        <Image
          src="/learning.png"
          alt="Learning Illustration"
          width={320}
          height={320}
          priority
          className="hover:scale-105 transition-transform duration-300 mb-4"
        />
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {TEXT.home.title}
          </h1>
          <p className="text-xl text-gray-600">{TEXT.home.description}</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Link href="/login">
            <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
              {TEXT.auth.loginButton}
            </Button>
          </Link>
          <Link href="/register">
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all"
            >
              {TEXT.auth.registerButton}
            </Button>
          </Link>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 items-center justify-center text-sm text-gray-600 backdrop-blur-sm bg-white/30 w-full py-4">
        <Link href="/about" className="hover:text-blue-600 hover:underline hover:underline-offset-4 transition-colors">
          关于我们
        </Link>
        <Link href="/help" className="hover:text-blue-600 hover:underline hover:underline-offset-4 transition-colors">
          使用帮助
        </Link>
      </footer>
    </div>
  )
}
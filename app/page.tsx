// import Image from "next/image"
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { TEXT } from '@/lib/constants/text'

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
//       <main className="flex flex-col gap-8 row-start-2 items-center text-center">
//         <Image
//           src="/learning.png"
//           alt="Learning Illustration"
//           width={320}
//           height={320}
//           priority
//           className="hover:scale-105 transition-transform duration-300 mb-4"
//         />
        
//         <div className="space-y-4">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             {TEXT.home.title}
//           </h1>
//           <p className="text-xl text-gray-600">{TEXT.home.description}</p>
//         </div>
        
//         <div className="flex gap-4 items-center">
//           <Link href="/login">
//             <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
//               {TEXT.auth.loginButton}
//             </Button>
//           </Link>
//           <Link href="/register">
//             <Button 
//               variant="outline" 
//               size="lg" 
//               className="rounded-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all"
//             >
//               {TEXT.auth.registerButton}
//             </Button>
//           </Link>
//         </div>
//       </main>

//       <footer className="row-start-3 flex gap-6 items-center justify-center text-sm text-gray-600 backdrop-blur-sm bg-white/30 w-full py-4">
//         <Link href="/about" className="hover:text-blue-600 hover:underline hover:underline-offset-4 transition-colors">
//           关于我们
//         </Link>
//         <Link href="/help" className="hover:text-blue-600 hover:underline hover:underline-offset-4 transition-colors">
//           使用帮助
//         </Link>
//       </footer>
//     </div>
//   )
// }

'use client'

import Image from "next/image"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TEXT } from '@/lib/constants/text'
import { motion } from "framer-motion"
import WordOfDay from '@/components/word-of-day'
import FeaturesPreview from '@/components/features-preview'
import StatsPreview from '@/components/stats-preview'
import { Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="flex flex-col gap-8 py-12 items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/learning.png"
            alt="Learning Illustration"
            width={320}
            height={320}
            priority
            className="hover:scale-105 transition-transform duration-300 mb-4"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-4 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {TEXT.home.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">{TEXT.home.description}</p>
        </motion.div>
        
        <motion.div 
          className="flex gap-4 items-center flex-wrap justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/login">
            <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all">
              {TEXT.auth.loginButton}
            </Button>
          </Link>
          <Link href="/register">
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all dark:border-purple-400 dark:text-purple-400"
            >
              {TEXT.auth.registerButton}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Globe className="w-5 h-5" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full max-w-6xl">
          <WordOfDay />
          <FeaturesPreview />
          <StatsPreview />
        </div>
      </main>

      <footer className="flex flex-col md:flex-row gap-6 items-center justify-between text-sm text-gray-600 dark:text-gray-400 backdrop-blur-sm bg-white/30 dark:bg-black/30 w-full py-6 px-8">
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-blue-600 hover:underline hover:underline-offset-4 transition-colors">
            关于我们
          </Link>
          <Link href="/help" className="hover:text-blue-600 hover:underline hover:underline-offset-4 transition-colors">
            使用帮助
          </Link>
          <Link href="/privacy" className="hover:text-blue-600 hover:underline hover:underline-offset-4 transition-colors">
            隐私政策
          </Link>
        </div>
        <div className="flex gap-6">
          <Link href="/blog" className="hover:text-blue-600 transition-colors">博客</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">联系我们</Link>
        </div>
      </footer>
    </div>
  )
}
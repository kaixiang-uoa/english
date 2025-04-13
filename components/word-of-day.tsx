// components/word-of-day.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WordOfDay() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">每日单词</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">serendipity</h3>
              <Button variant="ghost" size="icon">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">[ˌserənˈdɪpəti]</p>
            <p className="text-gray-700 dark:text-gray-300">
              n. 意外发现美好事物的能力；机缘巧合
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              "The discovery of penicillin was a perfect example of serendipity in scientific research."
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
// components/stats-preview.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function StatsPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">学习数据</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2,500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">词汇量</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">连续学习天数</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">89%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">正确率</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">42</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">完成课程</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
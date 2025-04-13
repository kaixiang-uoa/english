// components/features-preview.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Book, Headphones, MessageCircle, Trophy } from "lucide-react"

export default function FeaturesPreview() {
  const features = [
    { icon: Book, text: "课程学习" },
    { icon: Headphones, text: "听力练习" },
    { icon: MessageCircle, text: "口语对话" },
    { icon: Trophy, text: "成就系统" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">学习特色</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <feature.icon className="w-6 h-6 mb-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
import { supabase } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { startOfDay } from 'date-fns'

// 添加词云数据获取函数
export async function fetchUserWordCloudData() {
  try {
    // 使用 Supabase 客户端获取当前用户的单词
    const { data, error } = await supabase
      .from('words')
      .select('term, difficulty')
      .order('created_at', { ascending: false })
      .limit(25)  // 限制返回词云中显示的单词数量
    
    if (error) {
      console.error('Error fetching word cloud data:', error)
      return []
    }
    
    // 将数据转换为词云组件需要的格式
    return (data || []).map(item => ({
      text: item.term,
      value: Math.max(10, item.difficulty * 8)
    }))
  } catch (error) {
    console.error('Error in word cloud data processing:', error)
    return []
  }
}

// 添加获取用户最近活动的函数
export async function fetchRecentActivity() {
  try {
    // 获取最近添加或复习过的单词
    const { data, error } = await supabase
      .from('words')
      .select('id, term, last_review_at, created_at, difficulty')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }
    
    // 转换为活动格式
    return (data || []).map(item => {
      // 确定活动类型：如果有最后复习时间，则为reviewed；否则为learned
      // 我们不再使用 review_count 字段，因为它可能不存在
      const type = item.last_review_at ? 'reviewed' : 'learned'
      
      // 确定活动发生的时间戳
      const activityTime = item.last_review_at || item.created_at
      
      // 格式化为"x time ago"
      const timestamp = formatDistanceToNow(new Date(activityTime), { addSuffix: true })
      
      return {
        id: item.id,
        type,
        word: item.term, // 使用 term 代替 word
        timestamp
      }
    })
  } catch (error) {
    console.error('Error in recent activity processing:', error)
    return []
  }
}

// 添加获取用户统计数据的函数
export async function fetchUserStats() {
  try {
    // 1. 获取用户的总单词数
    const { count: totalWords, error: countError } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Error fetching total words count:', countError)
      return null
    }
    
    // 2. 获取今天学习的单词数
    const today = startOfDay(new Date()).toISOString()
    const { count: todayLearned, error: todayError } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)
    
    if (todayError) {
      console.error('Error fetching today learned count:', todayError)
      return null
    }
    
    // 3. 计算学习连续天数（这个比较复杂，可能需要额外表来追踪）
    // 这里我们使用一个简化的方法，仅检查是否有连续几天的学习记录
    const { data: activityData, error: activityError } = await supabase
      .from('words')
      .select('created_at')
      .order('created_at', { ascending: false })
    
    if (activityError) {
      console.error('Error fetching activity data for streak:', activityError)
      return null
    }
    
    // 简化计算连续天数的逻辑
    // 将日期转换为 YYYY-MM-DD 格式以去除时间部分，并去重
    const uniqueDates = [...new Set(
      (activityData || []).map(item => 
        new Date(item.created_at).toISOString().split('T')[0]
      )
    )].sort().reverse()
    
    // 计算连续天数
    let streak = 0
    const today2 = new Date().toISOString().split('T')[0]
    
    // 如果今天有学习，开始计数
    if (uniqueDates.length > 0 && uniqueDates[0] === today2) {
      streak = 1
      // 检查前几天
      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i])
        const previousDate = new Date(uniqueDates[i-1])
        previousDate.setDate(previousDate.getDate() - 1)
        
        // 如果日期连续，增加连续天数
        if (currentDate.toISOString().split('T')[0] === previousDate.toISOString().split('T')[0]) {
          streak++
        } else {
          break
        }
      }
    }
    
    // 返回统计数据
    return {
      totalWords: totalWords || 0,
      streak: streak,
      todayLearned: todayLearned || 0
    }
  } catch (error) {
    console.error('Error in fetchUserStats:', error)
    return null
  }
} 
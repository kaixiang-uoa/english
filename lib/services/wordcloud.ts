// lib/services/words.ts
import { supabase } from '@/lib/supabase/client'

export async function markWordAsReviewed(wordId: string) {
  const { data, error } = await supabase
    .from('words')
    .update({ 
      reviewed: true,
      review_count: supabase.rpc('increment_review_count'),
      last_review_at: new Date().toISOString()
    })
    .eq('id', wordId)
    .select()

  if (error) {
    console.error('Error updating word review status:', error)
    return null
  }

  return data
}

// 添加词云数据获取函数
export async function fetchUserWordCloudData() {
  try {
    // 使用 Supabase 客户端获取当前用户的单词
    const { data, error } = await supabase
      .from('words')
      .select('term, difficulty')  // 使用实际存在的字段名
      .order('created_at', { ascending: false })
      .limit(25)  // 限制返回词云中显示的单词数量
    
    if (error) {
      console.error('Error fetching word cloud data:', error)
      return []
    }
    
    // 将数据转换为词云组件需要的格式
    return (data || []).map(item => ({
      text: item.term,  // 使用 term 代替 word
      value: Math.max(10, item.difficulty * 8)  // 使用 difficulty 代替 review_count
    }))
  } catch (error) {
    console.error('Error in word cloud data processing:', error)
    return []
  }
}
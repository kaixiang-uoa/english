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
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    // 1. 获取用户实际学习过的单词数（满足以下任一条件的单词）:
    // - 有复习记录(last_review_at不为null)
    // - 复习次数大于0
    // - 被标记为已学习(reviewed=true)
    const { count: learnedWords, error: learnedError } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .or('last_review_at.not.is.null,review_count.gt.0,reviewed.eq.true')
    
    if (learnedError) {
      console.error('Error fetching learned words count:', learnedError)
      return null
    }

    // 获取今天的开始时间（UTC）
    const todayDate = startOfDay(new Date()).toISOString()
    
    // 2. 获取今天学习的单词 - 包括新添加和复习的
    // 2.1 获取今天添加的单词数
    const { count: todayAdded, error: todayAddedError } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayDate)
    
    if (todayAddedError) {
      console.error('Error fetching today added count:', todayAddedError)
      return null
    }
    
    // 2.2 获取今天复习的单词数（不包括今天添加的）
    const { count: todayReviewed, error: todayReviewedError } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lt('created_at', todayDate)  // 创建时间早于今天
      .gte('last_review_at', todayDate)  // 最后复习时间是今天
    
    if (todayReviewedError) {
      console.error('Error fetching today reviewed count:', todayReviewedError)
      return null
    }
    
    // 计算今天的总学习量：新添加 + 复习
    const todayLearned = (todayAdded || 0) + (todayReviewed || 0)
    
    // 3. 计算学习连续天数 - 仅考虑复习活动（忽略创建日期）
    // 仅获取单词复习的日期（不考虑创建日期）
    const { data: reviewedData, error: reviewedError } = await supabase
      .from('words')
      .select('last_review_at')
      .eq('user_id', user.id)
      .not('last_review_at', 'is', null);

    if (reviewedError) {
      console.error('Error fetching word review dates:', reviewedError)
      return null
    }

    // 检查是否有复习活动
    if (!reviewedData || reviewedData.length === 0) {
      console.log('没有任何复习活动，连续天数为0');
      return {
        totalWords: learnedWords || 0,
        streak: 0,
        todayLearned: todayLearned || 0
      }
    }

    // 只使用复习日期，忽略创建日期
    const allDates = reviewedData
      .filter(item => item.last_review_at) // 确保日期存在
      .map(item => new Date(item.last_review_at).toISOString().split('T')[0]);

    // 如果没有有效日期，返回0连续天数
    if (allDates.length === 0) {
      console.log('没有有效复习日期，连续天数为0');
      return {
        totalWords: learnedWords || 0,
        streak: 0,
        todayLearned: todayLearned || 0
      }
    }

    // 对日期进行排序（降序）- 最近的日期在前
    const uniqueDates = [...new Set(allDates)].sort().reverse();
    console.log('排序后的唯一复习日期:', uniqueDates);

    // 获取今天和昨天的日期字符串
    const currentDate = new Date();
    const todayStr = currentDate.toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    console.log('今天:', todayStr, '昨天:', yesterdayStr, '最近复习日:', uniqueDates[0]);

    // 如果没有最近的复习日期，或者最近复习既不是今天也不是昨天，连续天数为0
    if (!uniqueDates[0] || (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr)) {
      console.log('最近复习既不是今天也不是昨天，连续天数为0');
      return {
        totalWords: learnedWords || 0,
        streak: 0,
        todayLearned: todayLearned || 0
      }
    }

    // 计算连续天数
    let streak = 0;
    let startDate = uniqueDates[0] === todayStr ? todayStr : yesterdayStr;
    let checkDate = new Date(startDate);
    streak = 1; // 今天或昨天有活动，起始连续天数为1
    
    console.log('开始计算连续天数，起始日期:', startDate);
    
    // 从最近的活动日开始，检查前几天是否连续有活动
    for (let i = 1; i < uniqueDates.length; i++) {
      // 将当前日期减去1天
      checkDate.setDate(checkDate.getDate() - 1);
      const expectedPreviousDate = checkDate.toISOString().split('T')[0];
      
      console.log('预期前一天:', expectedPreviousDate, '实际日期:', uniqueDates[i]);
      
      // 如果实际前一天匹配预期，增加连续天数
      if (uniqueDates[i] === expectedPreviousDate) {
        streak++;
        console.log('日期匹配，连续天数增加到:', streak);
      } else {
        console.log('日期不匹配，连续性中断');
        break;
      }
    }
    
    console.log('最终计算的连续天数:', streak);

    // 返回统计数据
    return {
      totalWords: learnedWords || 0,
      streak: streak,
      todayLearned: todayLearned || 0
    }
  } catch (error) {
    console.error('Error in fetchUserStats:', error)
    return null
  }
} 
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// 创建 Supabase 客户端，使用环境变量中的配置
export const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

// 保留验证函数但简化它
export const validateSupabaseConfig = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase 环境变量可能未配置");
  }
};
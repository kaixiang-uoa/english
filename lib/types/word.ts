export interface Word {
  id: string;
  user_id: string;
  term: string;                   // 必填
  definition: string;            // 必填
  example?: string | null;       // 可选
  notes?: string | null;         // 可选
  category_id: string;           // 必填
  difficulty: number;            // 必填，1-5
  last_review_at?: string | null; // 可选
  reviewed: boolean;             // 必填
  review_count: number;          // 必填
  phonetic_us?: string | null;   // 可选
  phonetic_uk?: string | null;   // 可选
  pos?: string | null;           // 可选
  word_id?: string | null;       // 可选
  extra_json?: any | null;       // 可选
  created_at: string;            // 数据库自动生成
}

export interface Category {
  id: string
  name: string
  description?: string | null
  color?: string | null
}

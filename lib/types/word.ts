export interface Word {
  id: string
  term: string
  definition: string
  example?: string | null
  category_id: string
  difficulty: number
  notes?: string | null
  created_at: string
  last_review_at: string | null
  user_id: string
}

export interface Category {
  id: string
  name: string
  description?: string | null
  color?: string | null
}

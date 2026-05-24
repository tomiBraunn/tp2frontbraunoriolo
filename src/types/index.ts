export interface Profile {
  id: string
  username: string
  created_at: string
}

export interface Poll {
  id: string
  title: string
  description: string
  created_by: string
  created_at: string
  is_active: boolean
  profiles?: Profile
  options?: PollOption[]
}

export interface PollOption {
  id: string
  poll_id: string
  option_text: string
  created_at: string
  votes?: Vote[]
  vote_count?: number
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  user_id: string
  created_at: string
}

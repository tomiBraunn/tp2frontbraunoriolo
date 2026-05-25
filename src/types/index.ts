export interface Profile {
  id: string
  username: string
  created_at: string
}

export interface Poll {
  id: string
  title: string
  description: string
  created_by: string | null
  created_at: string
  allow_multiple: boolean
  is_active: boolean
  profiles?: Profile
  options?: PollOption[]
}

export interface PollOption {
  id: string
  poll_id: string
  option_text: string
  votes?: Vote[]
  vote_count?: number
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  voter_id: string | null
  voter_session: string
  created_at: string
}

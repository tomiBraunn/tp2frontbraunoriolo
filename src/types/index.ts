export interface Profile {
  id: string
  username: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  created_by: string
  created_at: string
  updated_at: string
  is_active: boolean
  profiles?: Profile
}

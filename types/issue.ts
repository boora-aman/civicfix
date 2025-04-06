export interface Issue {
  id: string
  title: string
  description: string
  location: string
  city?: string
  state?: string
  zip?: string
  category: string
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  userId?: string
  user?: {
    id: string
    name: string | null
    image: string | null
  }
  images?: {
    id: string
    url: string
  }[]
  comments?: number | any[]
  upvotes?: number
  updates?: {
    id: string
    status: string
    note: string
    createdAt: string
  }[]
}


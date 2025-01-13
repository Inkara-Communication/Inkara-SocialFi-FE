export interface IUserSimple {
  id: string
  username: string
  address: string
  photo: {
    url: string
  }
}

export interface IUserProfile {
  id: string
  username: string
  role: string
  address: string
  bio?: string
  createdAt: string
  updatedAt: string
  photo: {
    url: string
  }
  postCount?: number
  followerCount?: number
  nftCount?: number
}

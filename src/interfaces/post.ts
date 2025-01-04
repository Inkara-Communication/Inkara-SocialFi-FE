// import { ICommment } from './comment';

export interface ILikes {
  id: string;
  userId: string;
  postId: string;
  type: 'post' | 'comment';
  createdAt: string;
  updatedAt: string;
}
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPost {
  id: string;
  content: string;
  photoId?: string;
  creator: string;
  type: 'text' | 'media';
  createdAt: string;
  updatedAt: string;
  likes: ILikes[]
  comments?: Comment[];
}

export enum GetPostType {
  FOLLOWING = 'FOLLOWING',
  EXPLORER = 'EXPLORER'
}

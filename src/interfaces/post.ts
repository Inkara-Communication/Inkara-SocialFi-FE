// import { ICommment } from './comment';

import { IComment } from './comment';
import { IUserSimple } from './user';

export interface ILikes {
  id: string;
  userId: string;
  postId: string;
  type: 'post' | 'nft';
  createdAt: string;
  updatedAt: string;
}

export interface IPost {
  id: string;
  content: string;
  photo?: {
    id?: string
    url?: string;
  };
  creatorId: string;
  type: 'text' | 'media';
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  likes: ILikes[];
  comments: IComment[];
  user: IUserSimple;
}

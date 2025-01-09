// import { ICommment } from './comment';

import { IUserSimple } from "./user";

export interface ILikes {
  id: string;
  userId: string;
  postId: string;
  type: 'post' | 'nft';
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
  photo: {
    url?: string;
  };
  creatorId: string;
  type: 'text' | 'media';
  createdAt: string;
  updatedAt: string;
  likes: ILikes[]
  comments?: Comment[];
  user: IUserSimple;
}

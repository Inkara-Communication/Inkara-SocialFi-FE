import { IUserSimple } from './user';

export interface IComment {
  id: string;
  postId: string;
  creatorId: string;
  content: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  user: IUserSimple;
}

export interface IComment {
  id: string;
  postId: string;
  creatorId: string;
  content: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  user: IUserSimple;
  _count?: {
    children: number;
  };
}
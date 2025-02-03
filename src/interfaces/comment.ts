import { IUserSimple } from './user';

export interface IComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: IUserSimple;
  children: IChilrenComment[];
}

export interface IChilrenComment {
  id: string;
  postId: string;
  userId: string;
  parentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: IUserSimple;
}

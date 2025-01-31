import { IUserSimple } from './user';

export interface ICommment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  children: IChilrenComment[];
}

export interface IChilrenComment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: IUserSimple;
}

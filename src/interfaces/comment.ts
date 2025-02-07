import { IUserSimple } from './user';

export interface IComment {
  id: string;
  postId: string;
  creatorId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user: IUserSimple;
}

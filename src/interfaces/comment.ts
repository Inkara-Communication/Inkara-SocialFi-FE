import { ILikes } from './post';
import { IUserSimple } from './user';

export interface IComment {
  id: string;
  postId: string;
  creatorId: string;
  content: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  likes: ILikes[];
  user: IUserSimple;
  _count?: {
    children: number;
  };
}
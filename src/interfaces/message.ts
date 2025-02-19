import { IUserSimple } from "./user";

export interface IMessage {
  id: string;
  text: string;
  edited: boolean;
  isRead: boolean;
  author: IUserSimple;
  roomId?: string;
  conversationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
import { IMessage } from "./message";

export interface IRoom {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  users: IRoomUser[];
  messages: IMessage[];
  invitations: IInvitation[];
}

export interface IInvitation {
  id: string;
  code: string;
  userId: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface IRoomUser {
  roomId: string;
  userId: string;
  joinedAt: Date;
  expiresAt?: Date;
}
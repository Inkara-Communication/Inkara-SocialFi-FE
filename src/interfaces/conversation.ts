import { IMessage } from "./message";
import { IUserSimple } from "./user";

export interface IConversation {
  id: string;
  creator: IUserSimple;
  recipient: IUserSimple;
  createdAt: Date;
  updatedAt: Date;
  messages: IMessage[];
}

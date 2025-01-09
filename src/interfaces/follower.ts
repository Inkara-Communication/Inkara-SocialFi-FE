import { IUserSimple } from "./user";

export interface IFollower {
  id: string;
  username: string;
  address: string;
  photo: {
    url?: string;
  }
}

export interface IFollowing {
  id: string;
  followingId: string;
  followerId: string;
  following: IUserSimple
}

export enum ListFollowerType {
  LIST_FOLLOWERS = 'LIST_FOLLOWERS',
  LIST_FOLLOWINGS = 'LIST_FOLLOWINGS'
}
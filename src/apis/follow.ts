/* eslint-disable @typescript-eslint/no-explicit-any */
import { IApiResponse } from '@/interfaces/api-response';
import {
  default as axiosInstance,
  endpoints,
} from '@/utils/axios';

// ----------------------------------------------------------------------

export const followAction = async (followingId: string): Promise<IApiResponse<any>> => {
  const { data } = await axiosInstance.post(endpoints.follow.followAction(followingId));
  return data;
};

export const hasFollowed = async (id: string): Promise<boolean> => {
  try {
    const { data } = await axiosInstance.get(endpoints.follow.hasFollowed(id));
    return data.data;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const listFollows = async (id: string): Promise<IApiResponse<any>> => {
  const { data } = await axiosInstance.get(endpoints.follow.listFollows(id));
  return data;
}

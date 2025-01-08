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
    const response = await axiosInstance.get(endpoints.follow.hasFollowed(id));
    return response.data;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const listFollows = async (
  period: 'DAY',
  filterBy: string,
  startId: 0,
  offset: 1,
  limit: 5,
): Promise<IApiResponse<any>> => {
  const filter = {
    period,
    filterBy,
  }
  const pagination = {
    startId,
    offset,
    limit,
  }
  const response = await axiosInstance.get<IApiResponse<any>>(
    endpoints.follow.listFollows,
    {
      params: {
        ...filter,
        ...pagination
      }
    });
  return response.data;
}

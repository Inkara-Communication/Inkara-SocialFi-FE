/* eslint-disable @typescript-eslint/no-explicit-any */
import { IApiResponse } from '@/interfaces/api-response';
import {
  default as axiosInstance,
  endpoints,
} from '@/utils/axios';
import { InputFilter } from './dto/filter.dto';
import { InputPagination } from './dto/pagination.dto';
import { IFollowing } from '@/interfaces/follower';

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
  { filterBy }: InputFilter,
  { startId,
    offset,
    limit }: InputPagination
): Promise<IApiResponse<IFollowing[]>> => {
  const filter = {
    period: 'ALL',
    filterBy,
  }
  const pagination = {
    startId,
    offset,
    limit,
  }
  const response = await axiosInstance.get<IApiResponse<IFollowing[]>>(
    endpoints.follow.listFollows,
    {
      params: {
        ...filter,
        ...pagination
      }
    });
  return response.data;
}

export const whoToFollow = async (): Promise<IApiResponse<any>> => {
  const response = await axiosInstance.get<IApiResponse<any>>(
    endpoints.follow.whoToFollow
  );
  return response.data;
}

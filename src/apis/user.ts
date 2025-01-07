/* eslint-disable @typescript-eslint/no-explicit-any */
import { IApiResponse } from '@/interfaces/api-response';
import { IUserProfile } from '@/interfaces/user';
import {
  default as axios,
  default as axiosInstance,
  endpoints,
} from '@/utils/axios';

// ----------------------------------------------------------------------

interface IGetUserListParams {
  url: string;
  params: Record<string, any>;
}

export const getUserList = async <T>({
  url,
  params,
}: IGetUserListParams): Promise<T> => {
  const { data } = await axios.get<T>(url, {
    params,
  });

  return data;
};

export const getUserProfile = async (): Promise<IApiResponse<IUserProfile>> => {
  const { data } = await axiosInstance.get(endpoints.user.me);

  return data;
};

export const updateUserProfile = async (
  profileData: Partial<IUserProfile> & { password?: string }
): Promise<IApiResponse<IUserProfile>> => {
  const { data } = await axiosInstance.patch(
    endpoints.user.me,
    profileData
  );
  return data;
};

export const getUserProfileById = async (
  userId: string
): Promise<IApiResponse<IUserProfile>> => {
  const { data } = await axiosInstance.get(endpoints.user.profileById(userId));

  return data;
};

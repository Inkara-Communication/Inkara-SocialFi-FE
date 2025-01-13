import axiosInstance from '@/utils/axios';
import { endpoints } from '@/utils/axios';

import { IPost } from '@/interfaces/post';
import { IApiResponse } from '@/interfaces/api-response';
import { CreatePost, UpdatePost } from '@/schema/posts-schema';
import { InputFilter } from './dto/filter.dto';
import { InputPagination } from './dto/pagination.dto';

//--------------------------------------------------------------------------------------------

export const getPosts = async (
  { filterBy }: InputFilter,
  { startId, offset, limit }: InputPagination
): Promise<IApiResponse<IPost[]>> => {
  const filter = {
    period: 'ALL',
    filterBy,
  };
  const pagination = {
    startId,
    offset,
    limit,
  };
  const response = await axiosInstance.get<IApiResponse<IPost[]>>(
    endpoints.post.getMany,
    {
      params: {
        ...filter,
        ...pagination,
      },
    }
  );
  return response.data;
};

export const getPostDetail = async (
  id: string
): Promise<IApiResponse<IPost>> => {
  const response = await axiosInstance.get(`${endpoints.post.getById}/${id}`);
  return response.data;
};

export const createPost = async (
  data: CreatePost
): Promise<IApiResponse<string>> => {
  const { image, ...rest } = data;

  const response = await axiosInstance.post(
    endpoints.post.create,
    image ? data : rest
  );

  return response.data;
};

export const updatePost = async (
  data: UpdatePost
): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.patch(
    endpoints.post.update(data.id as string),
    data
  );

  return response.data;
};

export const deletePost = async (id: string): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.delete(endpoints.post.update(id));

  return response.data;
};

export const getPostsByUser = async (
  { startId, offset, limit }: InputPagination,
  userId: string
): Promise<IApiResponse<IPost[]>> => {
  const pagination = {
    startId,
    offset,
    limit,
  };
  const response = await axiosInstance.get<IApiResponse<IPost[]>>(
    endpoints.post.getMaynyByUser(userId), {
    params: {
      ...pagination,
    },
  }
  );
  return response.data;
};

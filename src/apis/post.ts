import axiosInstance from '@/utils/axios';
import { endpoints } from '@/utils/axios';

import { IPost } from '@/interfaces/post';
import { IApiResponse } from '@/interfaces/api-response';
import { CreatePost, UpdatePost } from '@/schema/posts-schema';

//--------------------------------------------------------------------------------------------

export const getPosts = async (
  period: 'DAY',
  filterBy: 'EXPLORER',
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
    endpoints.post.getMany,
    {
      params: {
        ...filter,
        ...pagination
      }
    }
  );
  console.log(response.data);
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

export const likePost = async (
  postId: string
): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.post(endpoints.post.like(postId));
  return response.data;
};

export const unlikePost = async (
  postId: string
): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.delete(endpoints.post.unlike(postId));
  return response.data;
};

export const savePost = async (
  postId: string
): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.post(endpoints.post.save(postId));
  return response.data;
};

export const unsavePost = async (
  postId: string
): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.post(endpoints.post.unsave(postId));
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

export const deletePost = async (
  id: string
): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.delete(endpoints.post.update(id));

  return response.data;
};
import axiosInstance, { endpoints } from '@/utils/axios';

import { IApiResponse } from '@/interfaces/api-response';
import { IComment } from '@/interfaces/comment';
import { InputPagination } from './dto/pagination.dto';

//--------------------------------------------------------------------------------------------

export const getComments = async (
  postId: string | null,
  parentId: string | null,
  { startId, offset, limit }: InputPagination
): Promise<IApiResponse<IComment[]>> => {
  const pagination = {
    startId,
    offset,
    limit,
  }

  const response = await axiosInstance.get(
    endpoints.comment.get,
    {
      params: {
        postId: postId,
        parentId: parentId,
        ...pagination,
      },
    }
  );

  return response.data;
};

export const createComment = async (
  id: string,
  data: { content: string; parentId: string | null }
): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.post(
    endpoints.comment.create(id),
    data
  );

  return response.data;
};

export const updateComment = async (
  id: string,
  content: string
): Promise<IApiResponse<void>> => {
  const response = await axiosInstance.patch(
    endpoints.comment.update(id),
    content
  );

  return response.data;
};

export const deleteComment = async (
  id: string
): Promise<IApiResponse<void>> => {
  const response = await axiosInstance.delete(
    endpoints.comment.delete(id)
  );

  return response.data;
};
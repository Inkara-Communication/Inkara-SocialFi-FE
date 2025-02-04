import axiosInstance, { endpoints } from '@/utils/axios';

import { IApiResponse } from '@/interfaces/api-response';
import { IComment } from '@/interfaces/comment';
import { InputPagination } from './dto/pagination.dto';

//--------------------------------------------------------------------------------------------

export const getCommennts = async (
  id: string,
  { startId, offset, limit }: InputPagination
): Promise<IApiResponse<IComment[]>> => {
  const pagination = {
    startId,
    offset,
    limit,
  }
  const response = await axiosInstance.get(
    endpoints.comment.get(id),
    {
      params: {
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
  data: { content: string }
): Promise<IApiResponse<void>> => {
  const response = await axiosInstance.put(
    endpoints.comment.update(id),
    data
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
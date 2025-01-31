import axiosInstance, { endpoints } from '@/utils/axios';

import { IApiResponse } from '@/interfaces/api-response';
import { ICommment } from '@/interfaces/comment';
import { InputPagination } from './dto/pagination.dto';

//--------------------------------------------------------------------------------------------

export const getCommennts = async (
  id: string,
  { startId, offset, limit }: InputPagination
): Promise<IApiResponse<ICommment[]>> => {
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

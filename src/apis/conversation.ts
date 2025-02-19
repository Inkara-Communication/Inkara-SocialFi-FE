import axiosInstance from '@/utils/axios';
import { endpoints } from '@/utils/axios';

import { IApiResponse } from '@/interfaces/api-response';
import { IConversation } from '@/interfaces/conversation';

//--------------------------------------------------------------------------------------------

export const getConversations = async (): Promise<IApiResponse<IConversation[]>> => {
  const response = await axiosInstance.get<IApiResponse<IConversation[]>>(endpoints.conversation.get);
  return response.data;
};

export const getConversation = async (
  id: string
): Promise<IApiResponse<IConversation>> => {
  const response = await axiosInstance.get(endpoints.conversation.getById(id));
  return response.data;
};

export const getUserConversations = async (): Promise<IApiResponse<IConversation[]>> => {
  const response = await axiosInstance.get<IApiResponse<IConversation[]>>(
    endpoints.conversation.getMyConversation
  );

  return response.data;
};

export const createConversation = async (
  recipientId: string
): Promise<IApiResponse<IConversation>> => {
  const response = await axiosInstance.post(
    endpoints.conversation.create,
    recipientId
  );

  return response.data;
};

import axiosInstance from '@/utils/axios';
import { endpoints } from '@/utils/axios';

import { IApiResponse } from '@/interfaces/api-response';
import { IMessage } from '@/interfaces/message';

//--------------------------------------------------------------------------------------------

export const findMessageForRoom = async (
    id: string
): Promise<IApiResponse<IMessage[]>> => {
    const response = await axiosInstance.get<IApiResponse<IMessage[]>>(
        endpoints.message.getMessageRoom(id)
    );
    return response.data;
};

export const createMessage = async (
    roomId: string,
    content: string,
    type: 'room' | 'conversation'
): Promise<IApiResponse<IMessage>> => {
    const response = await axiosInstance.post(
        endpoints.message.createMessageRoom(roomId),
        {
            content,
            type
        }
    );
    return response.data;
};

export const createPost = async (): Promise<IApiResponse<IMessage>> => {
    const response = await axiosInstance.get(
        endpoints.message.getMessage
    );

    return response.data;
};
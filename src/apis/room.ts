import axiosInstance from '@/utils/axios';
import { endpoints } from '@/utils/axios';

import { IApiResponse } from '@/interfaces/api-response';
import { IRoom } from '@/interfaces/room';

//--------------------------------------------------------------------------------------------

export const getInvitationByCode = async (
    code: string
): Promise<IApiResponse<IRoom[]>> => {
    const response = await axiosInstance.get<IApiResponse<IRoom[]>>(
        endpoints.room.getInvitation,
        {
            params: { code }
        }
    );
    return response.data;
};

export const getInvitations = async (): Promise<IApiResponse<IRoom[]>> => {
    const response = await axiosInstance.get<IApiResponse<IRoom[]>>(
        endpoints.room.getInvitations,
    );
    return response.data;
};

export const inviteToRoom = async (
    roomId: string
): Promise<IApiResponse<IRoom>> => {
    const response = await axiosInstance.post(
        endpoints.room.invite(roomId)
    );
    return response.data;
};

export const getRooms = async (): Promise<IApiResponse<IRoom>> => {
    const response = await axiosInstance.get(
        endpoints.room.getMany
    );

    return response.data;
};

export const getRoomById = async (id: string): Promise<IApiResponse<IRoom>> => {
    const response = await axiosInstance.get(
        endpoints.room.getById(id)
    );

    return response.data;
};

export const getUsersRoom = async (): Promise<IApiResponse<IRoom>> => {
    const response = await axiosInstance.get(
        endpoints.room.getMyRooms
    );

    return response.data;
};

export const createRoom = async (
    data: { name?: string; description?: string, isPublic?: boolean }
): Promise<IApiResponse<IRoom>> => {
    const response = await axiosInstance.post(
        endpoints.room.create,
        data
    );

    return response.data;
};

export const addUserToRoom = async (
    roomId: string,
    userId: string
): Promise<IApiResponse<IRoom>> => {
    const response = await axiosInstance.post(
        endpoints.room.addUser(roomId),
        userId
    );

    return response.data;
};

export const removeUserFromRoom = async (
    roomId: string,
    userId: string
): Promise<IApiResponse<IRoom>> => {
    const response = await axiosInstance.post(
        endpoints.room.removeUser(roomId),
        userId
    );

    return response.data;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { IApiResponse } from '@/interfaces/api-response';
import { default as axiosInstance, endpoints } from '@/utils/axios';

// ----------------------------------------------------------------------

export const likeAction = async (
    typeLike: 'post' | 'comment' | 'nft',
    likeId: string
): Promise<IApiResponse<void>> => {
    const response = await axiosInstance.post(
        endpoints.like.likeAction,
        { typeLike: typeLike, likeId }
    );
    return response.data;
};

export const hasLiked = async (
    typeLike: 'post' | 'comment' | 'nft',
    likeId: string
): Promise<boolean> => {
    try {
        const response = await axiosInstance.get(endpoints.like.hasLiked(likeId), {
            params: { typeLike }
        });
        return response.data;
    } catch {
        return false;
    }
};
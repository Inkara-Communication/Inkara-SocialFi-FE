import { IApiResponse } from '@/interfaces/api-response';
import axiosInstance, { endpoints } from '@/utils/axios';

//-------------------------------------------------------------------------------------------

interface SignInParams {
  address: string;
  signature: string;
}

interface SignUpParams {
  address: string;
}

export const login = async ({ address, signature }: SignInParams): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.post(endpoints.auth.login, {
    address,
    signature,
  });
  return response.data;
}

export const register = async (params: SignUpParams): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.post(endpoints.auth.register, params);
  return response.data;
};

export const logout = async (): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.post(endpoints.auth.logout);
  return response.data;
}
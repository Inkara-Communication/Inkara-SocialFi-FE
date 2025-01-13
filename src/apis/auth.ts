import { AUTH_TOKEN, USER_INFO } from '@/constant';
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

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export const login = async ({
  address,
  signature,
}: SignInParams): Promise<IApiResponse<ITokens>> => {
  const response = await axiosInstance.post(endpoints.auth.login, {
    address,
    signature,
  });
  return response.data;
};

export const register = async (
  params: SignUpParams
): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.post(endpoints.auth.register, params);
  return response.data;
};

export const logout = async (): Promise<IApiResponse<string>> => {
  const response = await axiosInstance.post(endpoints.auth.logout);
  return response.data;
};

export const refresh = async (): Promise<void> => {
  const user = JSON.parse(localStorage.getItem(USER_INFO) || '{}');
  const response = await axiosInstance.post(endpoints.auth.refresh, {
    user: {
      id: user.id,
      address: user.address
    }
  }, { withCredentials: true });
  const { accessToken } = response.data;
  localStorage.setItem(AUTH_TOKEN, accessToken);
}
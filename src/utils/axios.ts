'use client';

import axios, { AxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';

import { HOST_API } from '../global-config';

//----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const router = useRouter();
        router.push('/login');
      }
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    login: `/auth/signin`,
    register: `/auth/signup`,
    logout: `/auth/signout`,
  },

  user: {
    me: `/user/me`,
    create: `/profile/`,
    update: `/profile`,
    profile: (id: string) => `user/${id}`,
    profileById: (id: string) => `/user/${id}`,
  },

  follow: {
    hasFollowed: (id: string) => `/follow/check/${id}`,
    followAction: (followingId: string) => `/follow/${followingId}`,
    listFollows: `/follow/list`
  },

  post: {
    getById: (id: string) => `/post/${id}`,
    getMany: `/post`,
    create: `/post`,
    update: (id: string) => `/post/${id}`,
    delete: (id: string) => `/post/${id}`,
    detail: `/post/:id`,
    like: (id: string) => `/post/${id}/like`,
    unlike: (id: string) => `/post/${id}/unlike`,
    save: (id: string) => `/post/${id}/save`,
    unsave: (id: string) => `/post/${id}/unsave`,
  },
  media: {
    upload: `/upload-file`,
  },

  notification: {
    get: `/notification`,
    read: (id: string) => `/notifications/${id}/read`,
    readAll: `/notifications/read-all`,
  },

  comment: {
    get: `/comments`,
  },
};

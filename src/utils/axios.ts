'use client';

import axios, { AxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';

import { HOST_API } from '../global-config';

//----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
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
    login: `/signin`,
    register: `/signup`,
  },

  user: {
    get: `/me`,
    create: `/profile/`,
    update: `/profile`,
    profile: `/profile`,
    bookmark: (id: string) => `/users/${id}/saved-posts`,
    followers: (id: string) => `/users/${id}/followers`,
    followings: (id: string) => `/users/${id}/followings`,
    follow: (id: string) => `/users/${id}/follow`,
    unfollow: (id: string) => `/users/${id}/unfollow`,
    profileById: (id: string) => `/users/${id}`,
    hasFollowed: (id: string) => `/users/${id}/has-followed`,
  },

  post: {
    get: `/posts`,
    create: `/posts`,
    update: (id: string) => `/posts/${id}`,
    delete: (id: string) => `/posts/${id}`,
    detail: `/posts/:id`,
    like: (id: string) => `/posts/${id}/like`,
    unlike: (id: string) => `/posts/${id}/unlike`,
    save: (id: string) => `/posts/${id}/save`,
    unsave: (id: string) => `/posts/${id}/unsave`,
  },
  media: {
    upload: `/upload-file`,
  },

  topic: {
    get: `/topics`,
    detail: `/topics/:id`,
    create: `/topics`,
  },

  notification: {
    get: `/notifications`,
    read: (id: string) => `/notifications/${id}/read`,
    readAll: `/notifications/read-all`,
  },

  comment: {
    get: `/comments`,
  },
};

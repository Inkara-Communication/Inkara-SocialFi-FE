'use client';

import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from '../global-config';
import { AUTH_TOKEN, USER_INFO } from '@/constant';

//----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const user = JSON.parse(localStorage.getItem(USER_INFO) || '{}');
        if (!user) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
        const response = await axiosInstance.post(endpoints.auth.refresh, {
          user: {
            id: user.id,
            address: user.address
          }
        }, { withCredentials: true });
        const accessToken = response.data.data.accessToken
        localStorage.setItem(AUTH_TOKEN, accessToken);
        processQueue(null, accessToken);
        isRefreshing = false;

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(err);
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
    refresh: `/auth/refresh`
  },

  user: {
    me: `/user/me`,
    create: `/profile/`,
    update: `/user/update-profile`,
    profile: (id: string) => `user/${id}`,
    profileById: (id: string) => `/user/${id}`,
  },

  follow: {
    hasFollowed: (id: string) => `/follow/check/${id}`,
    followAction: (followingId: string) => `/follow/${followingId}`,
    listFollows: `/follow/list`,
    whoToFollow: `/follow/who-to-follow`,
    countFollows: (id: string) => `/follow/${id}/count`,
  },

  post: {
    getById: (id: string) => `/post/${id}`,
    getMany: `/post`,
    getMaynyByUser: (id: string) => `/post/user/${id}`,
    create: `/post`,
    update: (id: string) => `/post/${id}`,
    delete: (id: string) => `/post/${id}`,
    detail: `/post/:id`,
    countPosts: (id: string) => `/post/${id}/count`,
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

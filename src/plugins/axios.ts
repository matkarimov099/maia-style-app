import axios, { type AxiosHeaderValue, type HeadersDefaults } from 'axios';
import { refreshToken } from '@/services/refresh-token';
import { tokenUtils } from '@/utils/token';

type Headers = {
  'Content-Type': string;
  Authorization: string;
} & { [key: string]: AxiosHeaderValue };

const API_URL = import.meta.env.VITE_API_URL;

const publicAxiosClient = axios.create({
  baseURL: API_URL,
});

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
} as Headers & HeadersDefaults;

axiosClient.interceptors.request.use(
  config => {
    const token = tokenUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = undefined;
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const config = err.config;

    if (config.url !== '/auth/login' && err.response) {
      if (err.response.status === 401 && !config?.sent) {
        config.sent = true;
        const result = await refreshToken();
        if (result?.accessToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${result.accessToken}`,
          };
          return axiosClient(config);
        }
      }
    }

    if (err.response?.data) {
      const errorData = err.response.data;
      const customError = {
        ...err,
        message: errorData.message || errorData.error || err.message,
        error_code: errorData.error_code,
      };
      return Promise.reject(customError);
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
export { publicAxiosClient };

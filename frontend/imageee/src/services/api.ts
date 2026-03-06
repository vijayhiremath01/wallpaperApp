import axios, { AxiosError } from 'axios';

type NormalizedError = {
  message: string;
  status?: number;
  details?: unknown;
};

export const api = axios.create({
  baseURL: 'http://10.207.24.57:3000/api',
  timeout: 12_000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as unknown;

    const normalized: NormalizedError = {
      message:
        (typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          typeof (data as { message?: unknown }).message === 'string' &&
          (data as { message: string }).message) ||
        error.message ||
        'Request failed',
      status,
      details: data,
    };

    return Promise.reject(normalized);
  },
);

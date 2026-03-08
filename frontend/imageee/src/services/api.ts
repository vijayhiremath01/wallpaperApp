import axios, { AxiosError } from 'axios';

type NormalizedError = {
  message: string;
  status?: number;
  details?: unknown;
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Temporary Log 
console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as unknown;
    const config: any = error.config || {};
    const shouldRetry =
      (!error.response || (status && status >= 500)) &&
      (config.__retryCount ?? 0) < 4;
    if (shouldRetry) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;
      const delay = Math.min(500 * 2 ** (config.__retryCount - 1), 8000);
      await new Promise((res) => setTimeout(res, delay));
      return api(config);
    }

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

export default api;

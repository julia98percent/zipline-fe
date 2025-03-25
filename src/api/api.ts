import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data as ApiResponse<null>);
    }
    return Promise.reject({
      success: false,
      code: 500,
      message: 'Unknown server error',
      data: null,
    });
  }
);

export default api;

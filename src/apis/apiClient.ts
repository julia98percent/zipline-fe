import axios, { AxiosInstance } from "axios";
import { showToast } from "@components/Toast";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let csrfToken: string | null = null;

const initializeCsrf = async () => {
  try {
    const response = await apiClient.get("/users/csrf");
    csrfToken = response.data.message;
  } catch (error) {
    console.error("CSRF 초기화 실패:", error);
  }
};

export const clearCsrfToken = () => {
  csrfToken = null;
};

export const getCsrfToken = async (): Promise<string | null> => {
  if (!csrfToken) {
    await initializeCsrf();
  }
  return csrfToken;
};

apiClient.interceptors.request.use(
  async (config) => {
    if (!csrfToken && config.method !== "get") {
      await initializeCsrf();
    }

    if (csrfToken && config.method !== "get") {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const isLoginRequest = originalRequest?.url?.includes("/users/login");

    if (error.response.status === 401 && !isLoginRequest) {
      showToast({
        message: "인증이 만료되었습니다. 다시 로그인해주세요.",
        type: "error",
      });
      location.replace("/sign-in");
    }

    return Promise.reject(error);
  }
);

export default apiClient;

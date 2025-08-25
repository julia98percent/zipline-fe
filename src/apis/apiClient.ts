import axios, { AxiosInstance } from "axios";
import { showToast } from "@components/Toast";
import { saveCurrentLocation } from "@utils/sessionUtil";
import useSessionStore from "@stores/useSessionStore";

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

const handleSessionExpired = () => {
  clearCsrfToken();
  sessionStorage.clear();
  
  const authPages = ["/sign-in", "/sign-up", "/find-account"];
  const isAuthPage = authPages.some(page => window.location.pathname.includes(page));
  
  if (!isAuthPage) {
    saveCurrentLocation();
    useSessionStore.getState().openSessionExpiredModal();
  }
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
      showToast({
        message: "네트워크 연결을 확인해주세요.",
        type: "error",
      });
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const isLoginRequest = originalRequest?.url?.includes("/users/login");
    const isSignupRequest = originalRequest?.url?.includes("/users/signup");
    const isPublicRequest =
      originalRequest?.url?.includes("/users/find-id") ||
      originalRequest?.url?.includes("/users/send-code") ||
      originalRequest?.url?.includes("/users/verify-code") ||
      originalRequest?.url?.includes("/users/reset-password") ||
      originalRequest?.url?.includes("csrf");

    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !isLoginRequest &&
      !isSignupRequest &&
      !isPublicRequest
    ) {
      handleSessionExpired();
      return Promise.reject(error);
    }

    if (error.response.status >= 500) {
      showToast({
        message:
          "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        type: "error",
      });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

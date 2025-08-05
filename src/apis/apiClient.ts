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

const handleSessionExpired = (
  message: string = "세션이 만료되었습니다. 다시 로그인해주세요."
) => {
  clearCsrfToken();
  sessionStorage.clear();

  showToast({
    message,
    type: "warning",
    duration: 4000,
  });

  setTimeout(() => {
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== "/sign-in" && currentPath !== "/") {
      localStorage.setItem("redirectAfterLogin", currentPath);
    }

    window.location.href = "/sign-in";
  }, 1500);
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
      originalRequest?.url?.includes("/users/reset-password");

    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !isLoginRequest &&
      !isSignupRequest &&
      !isPublicRequest
    ) {
      const message =
        error.response.status === 403
          ? "접근 권한이 없습니다. 다시 로그인해주세요."
          : "세션이 만료되었습니다. 다시 로그인해주세요.";

      handleSessionExpired(message);
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

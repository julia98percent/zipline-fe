import axios, { AxiosInstance } from "axios";
import { showToast } from "@/components/Toast";
import { saveCurrentLocation } from "@/utils/sessionUtil";

const getServerCookies = async (): Promise<string> => {
  if (typeof window !== "undefined") {
    return "";
  }

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.toString();
  } catch {
    return "";
  }
};

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
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

  if (typeof window === "undefined") {
    return;
  }

  const authPages = ["/sign-in", "/sign-up", "/find-account"];
  const isAuthPage = authPages.some((page) =>
    window.location.pathname.includes(page)
  );

  if (!isAuthPage) {
    saveCurrentLocation();
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      try {
        const serverCookies = await getServerCookies();
        if (serverCookies) {
          config.headers["Cookie"] = serverCookies;
        }
      } catch (error) {
        console.warn("서버 쿠키 설정 실패:", error);
      }
    }

    if (typeof window !== "undefined") {
      if (!csrfToken && config.method !== "get") {
        await initializeCsrf();
      }

      if (csrfToken && config.method !== "get") {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
      }
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
      if (typeof window !== "undefined") {
        showToast({
          message: "네트워크 연결을 확인해주세요.",
          type: "error",
        });
      }
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
      originalRequest?.url?.includes("/users/csrf") ||
      originalRequest?.url?.includes("csrf");

    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !isLoginRequest &&
      !isSignupRequest &&
      !isPublicRequest
    ) {
      // 클라이언트에서만 세션 만료 처리
      if (typeof window !== "undefined") {
        handleSessionExpired();
      }
      // 서버 사이드에서는 middleware가 처리하므로 에러만 전파
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const reissueTokenClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${
      sessionStorage.getItem("_ZA") || ""
    }`;

    // FormData 객체 감지 및 Content-Type 자동 조정
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
    if (
      error.response.status === 401 &&
      !originalRequest.__isRetryRequest &&
      !isLoginRequest
    ) {
      try {
        originalRequest.__isRetryRequest = true;

        const deviceId = localStorage.getItem("deviceId");

        const refreshResponse = await reissueTokenClient.get("/users/reissue", {
          headers: {
            "X-Device-Id": deviceId ?? "",
          },
        });
        const newAccessToken = refreshResponse?.data?.data?.accessToken ?? null;

        if (!newAccessToken) {
          throw new Error("Access Token 재발급 실패");
        }

        sessionStorage.setItem("_ZA", newAccessToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return axios(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem("_ZA");
        toast.error("인증이 만료되었습니다. 다시 로그인하세요.");
        window.location.replace("/sign-in");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

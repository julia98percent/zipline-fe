import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !error.config.__isRetryRequest) {
      try {
        error.config.__isRetryRequest = true;
        const refreshResponse = await apiClient.get("/users/reissue");

        const newAccessToken = refreshResponse?.data?.data?.accessToken ?? null;
        if (!newAccessToken) {
          throw new Error("Access Token 재발급 실패");
        }
        sessionStorage.setItem("_ZA", newAccessToken);

        error.config.headers = {
          ...error.config.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return axios(error.config);
      } catch {
        sessionStorage.removeItem("_ZA");
        alert("인증이 만료되었습니다. 다시 로그인하세요.");
      }

      return Promise.reject(error);
    }
  }
);

export default apiClient;

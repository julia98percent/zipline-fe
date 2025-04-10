import axios, { AxiosInstance } from "axios";

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

    if (error.response.status === 401 && !error.config.__isRetryRequest) {
      try {
        error.config.__isRetryRequest = true;
        const refreshResponse = await reissueTokenClient.get("/users/reissue");

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
      } catch (refreshError) {
        sessionStorage.removeItem("_ZA");
        alert("인증이 만료되었습니다. 다시 로그인하세요.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

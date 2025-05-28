import apiClient from "@apis/apiClient";

export const fetchUserInfo = async (setUser: any) => {
  try {
    const response = await apiClient.get("/users/info");
    if (response?.status === 200 && response?.data?.data) {
      setUser(response.data.data);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    throw error;
  }
};

import apiClient from "@apis/apiClient";

export const fetchCounsels = async (page: number, rowsPerPage: number) => {
  try {
    const response = await apiClient.get("/surveys/responses", {
      params: { page: page + 1, size: rowsPerPage },
    });

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch counsels:", error);
    throw error;
  }
};

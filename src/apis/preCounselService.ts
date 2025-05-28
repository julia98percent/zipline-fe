import apiClient from "@apis/apiClient";
import { PreCounselDetail } from "@ts/Counsel";

export const fetchPreCounselDetail = async (
  surveyResponseUid: number
): Promise<PreCounselDetail | null> => {
  try {
    const response = await apiClient.get(
      `/surveys/responses/${surveyResponseUid}`
    );

    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch survey detail:", error);
    throw error;
  }
};

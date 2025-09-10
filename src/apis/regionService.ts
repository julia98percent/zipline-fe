import apiClient from "@/apis/apiClient";
import { ApiResponse } from "@/types/apiResponse";
import { REGION_ERROR_MESSAGES } from "@/constants/clientErrorMessage";
import { Region } from "@/types/region";
import { handleApiResponse, handleApiError } from "@/utils/apiUtil";

export const fetchRegions = async (
  parentCortarNo: number
): Promise<Region[]> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<Region[]>>(
      `/region/${parentCortarNo}`
    );

    return handleApiResponse(response, REGION_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching regions");
  }
};

export const fetchSido = async (): Promise<Region[]> => {
  return fetchRegions(0);
};

export const fetchSigungu = async (sidoCortarNo: number): Promise<Region[]> => {
  return fetchRegions(sidoCortarNo);
};

export const fetchDong = async (sigunguCortarNo: number): Promise<Region[]> => {
  return fetchRegions(sigunguCortarNo);
};

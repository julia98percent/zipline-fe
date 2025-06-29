import apiClient from "@apis/apiClient";
import { COUNSEL_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { ApiResponse } from "@ts/apiResponse";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";

export const fetchCounsels = async (page: number, rowsPerPage: number) => {
  try {
    const { data: response } = await apiClient.get<ApiResponse>(
      "/surveys/responses",
      {
        params: { page: page + 1, size: rowsPerPage },
      }
    );

    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, "fetching counsels");
  }
};

// Dashboard related counsel functions
export const fetchDashboardCounsels = async (params: {
  sortType: "DUE_DATE" | "LATEST";
  page?: number;
  size?: number;
}) => {
  try {
    const { data: response } = await apiClient.get<ApiResponse>(
      `/dashboard/counsels?sortType=${params.sortType}&page=${
        params.page ?? 0
      }&size=${params.size ?? 5}`
    );

    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(
      error,
      `fetching counsels with sortType ${params.sortType}`
    );
  }
};

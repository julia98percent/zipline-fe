import apiClient from "@apis/apiClient";
import { COUNSEL_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { ApiResponse } from "@ts/apiResponse";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";
import { CounselDetail, PreCounselListData } from "@ts/counsel";

export const fetchCounsels = async (page: number, rowsPerPage: number) => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<PreCounselListData>
    >("/surveys/responses", {
      params: { page: page + 1, size: rowsPerPage },
    });

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

export const fetchCounselDetail = async (counselUid: string) => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<CounselDetail>>(
      `/counsels/${counselUid}`
    );
    console.log(response);
    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.FETCH_FAILED);
  } catch (error) {
    return handleApiError(error, `fetching counsel detail ${counselUid}`);
  }
};

export const updateCounsel = async (
  counselUid: string,
  updateData: {
    title: string;
    type: string;
    counselDate: string;
    dueDate: string;
    completed: boolean;
    counselDetails: Array<{
      question: string;
      answer: string;
    }>;
  }
) => {
  try {
    const { data: response } = await apiClient.put<ApiResponse>(
      `/counsels/${counselUid}`,
      updateData
    );

    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.UPDATE_FAILED);
  } catch (error) {
    return handleApiError(error, `updating counsel ${counselUid}`);
  }
};

export const deleteCounsel = async (counselUid: string) => {
  try {
    const { data: response } = await apiClient.delete<ApiResponse>(
      `/counsels/${counselUid}`
    );

    return handleApiResponse(response, COUNSEL_ERROR_MESSAGES.DELETE_FAILED);
  } catch (error) {
    return handleApiError(error, `deleting counsel ${counselUid}`);
  }
};

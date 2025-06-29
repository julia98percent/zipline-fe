import apiClient from "@apis/apiClient";
import { PreCounsel, PreCounselDetail, PreCounselListData } from "@ts/counsel";
import { COUNSEL_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { ApiResponse } from "@ts/apiResponse";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";

export const fetchPreCounselDetail = async (
  surveyResponseUid: number
): Promise<PreCounselDetail> => {
  try {
    const { data: response } = await apiClient.get<
      ApiResponse<PreCounselDetail>
    >(`/surveys/responses/${surveyResponseUid}`);

    return handleApiResponse(
      response,
      COUNSEL_ERROR_MESSAGES.PRE_COUNSEL_DETAIL_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching pre-counsel detail");
  }
};

// 설문 응답 목록 조회
export const fetchSurveyResponses = async (params: {
  page?: number;
  size?: number;
}): Promise<PreCounsel[]> => {
  try {
    const { data: response } = await apiClient.get("/surveys/responses", {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    });

    const result = handleApiResponse<PreCounselListData>(
      response,
      COUNSEL_ERROR_MESSAGES.FETCH_FAILED
    );
    return result.surveyResponses ?? [];
  } catch (error) {
    return handleApiError(error, "fetching survey responses");
  }
};

// 특정 설문 응답 상세 조회
export const fetchSurveyResponseDetail = async (
  surveyResponseUid: number
): Promise<PreCounsel> => {
  try {
    const { data: response } = await apiClient.get<ApiResponse<PreCounsel>>(
      `/surveys/responses/${surveyResponseUid}`
    );

    return handleApiResponse(
      response,
      COUNSEL_ERROR_MESSAGES.PRE_COUNSEL_DETAIL_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching survey response detail");
  }
};

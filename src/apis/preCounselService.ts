import apiClient from "@apis/apiClient";
import { PreCounselDetail } from "@ts/counsel";
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

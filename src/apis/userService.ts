import apiClient from "@apis/apiClient";
import { ApiResponse } from "@ts/apiResponse";
import { USER_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { handleApiError, handleApiResponse } from "@utils/apiUtil";

export const fetchUserInfo = async (): Promise<unknown> => {
  try {
    const response = await apiClient.get<ApiResponse>("/users/info");
    return handleApiResponse(
      response.data,
      USER_ERROR_MESSAGES.INFO_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching user info");
  }
};

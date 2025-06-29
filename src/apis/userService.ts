import { User } from "@ts/user";
import apiClient from "@apis/apiClient";
import { ApiResponse } from "@ts/apiResponse";
import { USER_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { handleApiError, handleApiResponse } from "@utils/apiUtil";

export const fetchUserInfo = async (): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>("/users/info");
    return handleApiResponse(
      response.data,
      USER_ERROR_MESSAGES.INFO_FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching user info");
  }
};

export const loginUser = async (userId: string, password: string) => {
  try {
    const response = await apiClient.post(
      "/users/login",
      {
        id: userId,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    return handleApiError(error, "logging in user");
  }
};

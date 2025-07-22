import { User, SignUpInput } from "@ts/user";
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

export const signupUser = async ({
  userId,
  password,
  passwordCheck,
  passwordQuestionUid,
  questionAnswer,
  name,
  phoneNumber,
  email,
}: SignUpInput) => {
  try {
    const response = await apiClient.post<ApiResponse>(
      "/users/signup",
      {
        id: userId,
        password,
        passwordCheck,
        passwordQuestionUid: Number(passwordQuestionUid),
        questionAnswer,
        name,
        phoneNo: phoneNumber,
        email,
      },
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export interface UpdateUserInfoRequest {
  name?: string;
  email?: string;
  phoneNo?: string;
  noticeMonth?: number;
  noticeTime?: string;
  url?: string;
}

export const updateUserInfo = async (
  data: UpdateUserInfoRequest
): Promise<void> => {
  try {
    const response = await apiClient.patch("/users/info", data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "updating user info");
  }
};

export interface FindIdRequest {
  name: string;
  email: string;
}

export interface FindIdResponse {
  id: string;
}

export const findUserId = async (data: FindIdRequest): Promise<string> => {
  try {
    const response = await apiClient.post<ApiResponse<FindIdResponse>>(
      "/users/find-id",
      data
    );
    return handleApiResponse(response.data, USER_ERROR_MESSAGES.FIND_ID_FAILED)
      .id;
  } catch (error) {
    return handleApiError(error, "finding user ID");
  }
};

export interface VerifyUserForPasswordResetRequest {
  userId: string;
  name: string;
  email: string;
  phoneNo: string;
}

export interface ResetPasswordRequest {
  userId: string;
  newPassword: string;
}

export const verifyUserForPasswordReset = async (
  data: VerifyUserForPasswordResetRequest
): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(
      "/users/verify-for-password-reset",
      data
    );
    return handleApiResponse(response.data, "사용자 인증에 실패했습니다.");
  } catch (error) {
    return handleApiError(error, "verifying user for password reset");
  }
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(
      "/users/reset-password",
      data
    );
    return handleApiResponse(response.data, "비밀번호 변경에 실패했습니다.");
  } catch (error) {
    return handleApiError(error, "resetting password");
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post("/users/logout", {}, { withCredentials: true });
  } catch (error) {
    return handleApiError(error, "logging out user");
  }
};

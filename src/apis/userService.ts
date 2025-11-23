import { User, SignUpInput } from "@/types/user";
import apiClient from "@/apis/apiClient";
import { ApiResponse } from "@/types/apiResponse";
import { USER_ERROR_MESSAGES } from "@/constants/clientErrorMessage";
import { handleApiError, handleApiResponse } from "@/utils/apiUtil";

export const fetchUserInfo = async (): Promise<User> => {
  try {
    console.log("[fetchUserInfo] Requesting /users/info...");
    const response = await apiClient.get<ApiResponse<User>>("/users/info");
    console.log("[fetchUserInfo] Response status:", response.status);
    console.log("[fetchUserInfo] Response headers:", response.headers);
    return handleApiResponse(
      response.data,
      USER_ERROR_MESSAGES.INFO_FETCH_FAILED
    );
  } catch (error) {
    console.error("[fetchUserInfo] ❌ Request failed:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: unknown;
          headers?: unknown
        }
      };
      console.error("[fetchUserInfo] Error status:", axiosError.response?.status);
      console.error("[fetchUserInfo] Error data:", axiosError.response?.data);
      console.error("[fetchUserInfo] Error headers:", axiosError.response?.headers);
    }
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
  email?: string;
  phoneNo?: string;
  verificationType: "EMAIL" | "PHONE";
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
  verificationType: "EMAIL" | "PHONE";
  phoneNo?: string;
  email?: string;
}

export interface ResetPasswordRequest {
  userId: string;
  newPassword: string;
  newPasswordCheck: string;
}

export const verifyUserForPasswordReset = async (
  data: VerifyUserForPasswordResetRequest
): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(
      "/users/send-code",
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

export interface VerifyCodeRequest {
  userId: string;
  code: string;
}

export const verifyCode = async (data: VerifyCodeRequest): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(
      "/users/verify-code",
      data
    );
    return handleApiResponse(response.data, "인증 코드 검증에 실패했습니다.");
  } catch (error) {
    return handleApiError(error, "verifying code");
  }
};

export interface RemainingTimeResponse {
  remainingSeconds: number;
  serverTimestamp: number;
  active: boolean;
}

export const getRemainingTime = async (userId: string): Promise<number> => {
  try {
    const response = await apiClient.get<ApiResponse<RemainingTimeResponse>>(
      `/users/remaining-time/${userId}`
    );
    const data = handleApiResponse(
      response.data,
      "남은 시간 조회에 실패했습니다."
    );
    return data.remainingSeconds;
  } catch (error) {
    return handleApiError(error, "getting remaining time");
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post("/users/logout", {}, { withCredentials: true });
  } catch (error) {
    return handleApiError(error, "logging out user");
  }
};

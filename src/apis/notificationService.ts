import apiClient from "@apis/apiClient";
import { Notification } from "@stores/useNotificationStore";
import { API_STATUS_CODES } from "@ts/apiResponse";
import { NOTIFICATION_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import { handleApiResponse, handleApiError } from "@utils/apiUtil";

interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Notification[]>>(
      "/notifications"
    );
    return handleApiResponse(
      response.data,
      NOTIFICATION_ERROR_MESSAGES.FETCH_FAILED
    );
  } catch (error) {
    return handleApiError(error, "fetching notifications");
  }
};

export const readNotification = async (
  notificationId: number
): Promise<Notification> => {
  try {
    const response = await apiClient.put<ApiResponse<Notification>>(
      `/notifications/${notificationId}/read`
    );
    return handleApiResponse(
      response.data,
      NOTIFICATION_ERROR_MESSAGES.READ_FAILED
    );
  } catch (error) {
    return handleApiError(error, "reading notification");
  }
};

export const readAllNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await apiClient.put<ApiResponse<Notification[]>>(
      `/notifications/read`
    );
    return handleApiResponse(
      response.data,
      NOTIFICATION_ERROR_MESSAGES.READ_ALL_FAILED
    );
  } catch (error) {
    return handleApiError(error, "reading all notifications");
  }
};

export const deleteNotification = async (
  notificationId: number
): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse>(
      `/notifications/${notificationId}`
    );

    if (
      response.status !== API_STATUS_CODES.SUCCESS ||
      !response.data?.success
    ) {
      throw new Error(
        response.data?.message || NOTIFICATION_ERROR_MESSAGES.DELETE_FAILED
      );
    }
  } catch (error) {
    return handleApiError(error, "deleting notification");
  }
};

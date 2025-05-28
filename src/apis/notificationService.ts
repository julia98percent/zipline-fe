import apiClient from "@apis/apiClient";
import { Notification, NotificationState } from "@stores/useNotificationStore";

export const fetchNotifications = async (
  setNotificationList: (notificationList: Notification[]) => void
) => {
  try {
    const response = await apiClient.get("/notifications");
    if (response?.status === 200 && response?.data?.data) {
      setNotificationList(response.data.data);
    }
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
};

export const readNotification = async (
  notificationId: number,
  updateNotification: NotificationState["updateNotification"]
) => {
  try {
    const response = await apiClient.put(
      `/notifications/${notificationId}/read`
    );
    const result = response?.data?.data;
    if (response?.status === 200 && result) {
      updateNotification(notificationId, result);
    }
  } catch (error) {
    console.error("Failed to read notification:", error);
  }
};

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

export const readAllNotification = async (
  updateNotification: NotificationState["updateNotification"]
) => {
  try {
    const response = await apiClient.put(`/notifications/read`);
    const result = response?.data?.data;
    if (response?.status === 200 && result) {
      for (const notification of result) {
        updateNotification(notification.uid, notification);
      }
    }
  } catch (error) {
    console.error("Failed to read all notifications:", error);
  }
};

export const deleteNotification = async (
  notificationId: number,
  deleteNotification: NotificationState["deleteNotification"]
) => {
  try {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    const isSuccess = response?.data?.success;
    if (response?.status === 200 && isSuccess) {
      deleteNotification(notificationId);
    }
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
};

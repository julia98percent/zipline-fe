import apiClient from "@apis/apiClient";
import { Notification } from "@stores/useNotificationStore";

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

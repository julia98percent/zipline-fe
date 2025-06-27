import useAuthStore from "@stores/useAuthStore";
import useUserStore from "@stores/useUserStore";
import useNotificationStore from "@stores/useNotificationStore";
import { clearCsrfToken } from "@apis/apiClient";

export const clearAllAuthState = () => {
  useAuthStore.getState().logout();
  useUserStore.getState().clearUser();
  useNotificationStore.getState().clearNotification();
  clearCsrfToken();
};

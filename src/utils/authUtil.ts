import useAuthStore from "@/stores/useAuthStore";
import useNotificationStore from "@/stores/useNotificationStore";
import { clearCsrfToken } from "@/apis/apiClient";

export const clearAllAuthState = () => {
  useAuthStore.getState().logout();
  useNotificationStore.getState().clearNotification();
  clearCsrfToken();
};

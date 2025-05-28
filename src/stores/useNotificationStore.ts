import { create } from "zustand";

type NotificationCategory =
  | "NEW_SURVEY"
  | "BIRTHDAY_MSG"
  | "CONTRACT_EXPIRED_MSG"
  | "SCHEDULE";

export interface Notification {
  category: NotificationCategory;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
  url: number;
}

interface NotificationState {
  notificationList: Notification[] | null;
  setNotificationList: (notificationList: Notification[]) => void;
  addNotificationList: (notification: Notification) => void;
  clearNotification: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  notificationList: null,
  setNotificationList: (notificationList) => set({ notificationList }),
  addNotificationList: (notification) =>
    set((state) => ({
      notificationList: state.notificationList
        ? [notification, ...state.notificationList]
        : [notification],
    })),
  clearNotification: () => set({ notificationList: null }),
}));

export default useNotificationStore;

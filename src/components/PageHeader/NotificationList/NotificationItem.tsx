import React from "react";
import { translateNotificationCategory } from "@utils/stringUtil";
import { formatDateTimeToKorean } from "@utils/dateUtil";
import {
  deleteNotification as deleteNotificationApi,
  readNotification,
} from "@apis/notificationService";
import type { Notification } from "@stores/useNotificationStore";
import useNotificationStore from "@stores/useNotificationStore";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import { showToast } from "@components/Toast";

interface NotificationItemProps {
  notification: Notification;
  onPreCounselClick: (uid: number) => void;
}

function NotificationItem({
  notification,
  onPreCounselClick,
}: NotificationItemProps) {
  const { updateNotification, deleteNotification } = useNotificationStore();
  const handleClick = async () => {
    if (notification.category === "NEW_SURVEY") {
      onPreCounselClick(notification.url);
      try {
        await readNotification(notification.uid);
        updateNotification(notification.uid, { read: true });
      } catch {
        showToast({
          message: "알림을 읽음 처리하는 중 오류가 발생했습니다.",
          type: "error",
        });
      }
    } else {
      console.log("Navigate to:", notification.url);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotificationApi(notification.uid);
      deleteNotification(notification.uid);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div
      className={`text-base text-left px-3 py-4 border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${
        notification.read ? "opacity-75" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="inline text-neutral-700 leading-relaxed">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">{`[${translateNotificationCategory(
                notification.category
              )}] `}</span>
              <span className="text-xs text-gray-500">
                {formatDateTimeToKorean(notification.createdAt)}
              </span>
            </div>
            {notification.content}
          </div>
          <IconButton onClick={handleDelete} className="p-0">
            <ClearIcon className="block fill-neutral-600!" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default React.memo(NotificationItem);

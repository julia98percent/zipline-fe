import React from "react";
import { translateNotificationCategory } from "@utils/stringUtil";
import { formatDateTimeToKorean } from "@utils/dateUtil";
import {
  deleteNotification,
  readNotification,
} from "@apis/notificationService";
import useNotificationStore from "@stores/useNotificationStore";
import type { Notification } from "@stores/useNotificationStore";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";

interface NotificationItemProps {
  notification: Notification;
  onPreCounselClick: (uid: number) => void;
}

function NotificationItem({
  notification,
  onPreCounselClick,
}: NotificationItemProps) {
  const { updateNotification, deleteNotification: deleteNotificationAction } =
    useNotificationStore();

  const handleClick = () => {
    if (notification.category === "NEW_SURVEY") {
      onPreCounselClick(notification.url);
      readNotification(notification.uid, updateNotification);
    } else {
      console.log("Navigate to:", notification.url);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(notification.uid, deleteNotificationAction);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div
      className={`text-base text-left border-gray-200 px-3 py-4 border-b-1 hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${
        !notification.read ? "bg-gray-100" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start flex-col gap-2">
        <div className="flex items-start gap-2">
          <p className="inline text-neutral-700 leading-relaxed">
            <span className="text-base font-medium">{`[${translateNotificationCategory(
              notification.category
            )}] `}</span>
            {notification.content}
          </p>
          <IconButton onClick={handleDelete}>
            <ClearIcon className="block fill-neutral-600!" />
          </IconButton>
        </div>
      </div>
      <span className="text-xs text-blue-500">
        {formatDateTimeToKorean(notification.createdAt)}
      </span>
    </div>
  );
}

export default React.memo(NotificationItem);

import React from "react";
import { translateNotificationCategory } from "@utils/stringUtil";
import { formatDateTimeToKorean } from "@utils/dateUtil";
import { readNotification } from "@apis/notificationService";
import useNotificationStore from "@stores/useNotificationStore";
import type { Notification } from "@stores/useNotificationStore";

interface NotificationItemProps {
  notification: Notification;
  onPreCounselClick: (uid: number) => void;
}

function NotificationItem({
  notification,
  onPreCounselClick,
}: NotificationItemProps) {
  const { updateNotification } = useNotificationStore();

  const handleClick = () => {
    if (notification.category === "NEW_SURVEY") {
      onPreCounselClick(notification.url);
      readNotification(notification.uid, updateNotification);
    } else {
      console.log("Navigate to:", notification.url);
    }
  };

  return (
    <div
      className={`text-base text-left border-gray-200 p-3 border-b-1 hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${
        notification.read ? "bg-gray-100" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start flex-col gap-2">
        <div className="">
          {!notification.read && (
            <div className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-1" />
          )}

          <p className="inline text-neutral-700 leading-relaxed">
            <span className="text-base font-medium">{`[${translateNotificationCategory(
              notification.category
            )}] `}</span>
            {notification.content}
          </p>
        </div>
        <span className="text-xs text-blue-500">
          {formatDateTimeToKorean(notification.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default React.memo(NotificationItem);

import { Box, Typography, List } from "@mui/material";
import type { Notification } from "@stores/useNotificationStore";
import { translateNotificationCategory } from "@utils/stringUtil";
import { formatDateTimeToKorean } from "@utils/dateUtil";
import { Link } from "react-router-dom";

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <Link to={`/counsel/pre/${notification.url}`}>
      <div
        className={`text-base text-left border-gray-200 p-3 border-b-1 hover:bg-blue-50 ${
          notification.read ? "bg-gray-100" : ""
        }`}
      >
        <div className="flex justify-between items-start flex-col">
          <div>
            {notification.read ? null : (
              <div className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-1" />
            )}

            <p className="inline text-neutral-700">
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
    </Link>
  );
}

function NotificationList({
  notifications = [],
}: {
  notifications: Notification[];
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 60,
        right: -50,
        backgroundColor: "white",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "16px",
        zIndex: 50,
        minWidth: "300px",
        maxHeight: "50vh",
        overflowY: "hidden",
        display: "flex",
      }}
    >
      <div className="flex flex-col align-items-left justify-between">
        <h4 className="flex text-gray-900 font-semibold mb-2 border-b-1 border-gray-200 pb-2">
          알림
        </h4>
        <List
          sx={{ padding: 0 }}
          className="divide-y divide-gray-200 min-w-[25vw] max-h-[50vh] overflow-y-scroll"
        >
          {notifications.length == 0 ? (
            <Box className="p-4 text-center">
              <Typography className="text-neutral-500">
                새로운 알림이 없습니다.
              </Typography>
            </Box>
          ) : (
            notifications.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))
          )}
        </List>
      </div>
    </Box>
  );
}

export default NotificationList;

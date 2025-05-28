import { Box, Typography, List } from "@mui/material";
import type { Notification } from "@stores/useNotificationStore";
import { translateNotificationCategory } from "@utils/stringUtil";
import { formatDateTimeToKorean } from "@utils/dateUtil";
import PreCounselDetailModal from "@components/PreCounselDetailModal";
import { useNotification } from "@hooks/useNotification";

interface NotificationItemProps {
  notification: Notification;
  onPreCounselClick: (uid: number) => void;
}

function NotificationItem({
  notification,
  onPreCounselClick,
}: NotificationItemProps) {
  const handleClick = () => {
    if (notification.category === "NEW_SURVEY") {
      onPreCounselClick(notification.url);
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

interface NotificationListProps {
  notifications: Notification[];
  onNotificationListModalStateChange?: (isOpen: boolean) => void;
}

function NotificationList({
  notifications = [],
  onNotificationListModalStateChange,
}: NotificationListProps) {
  const {
    isSurveyDetailModalOpen,
    isLoading,
    selectedPreCounsel,
    error,
    handlePreCounselClick,
    handleCloseModal,
    resetError,
  } = useNotification();

  const handleModalStateChange = (isOpen: boolean) => {
    onNotificationListModalStateChange?.(isOpen);
  };

  const handlePreCounselClickWithStateChange = async (uid: number) => {
    await handlePreCounselClick(uid);
    handleModalStateChange(true);
  };

  const handleCloseModalWithStateChange = () => {
    handleCloseModal();
    handleModalStateChange(false);
  };

  const handleErrorClose = () => {
    resetError();
  };

  return (
    <>
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
          maxWidth: "400px",
          maxHeight: "50vh",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          className="text-gray-900 font-semibold mb-3 pb-2 border-b border-gray-200"
        >
          알림
        </Typography>

        <List
          sx={{
            padding: 0,
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
          className="divide-y divide-gray-200"
        >
          {notifications.length === 0 ? (
            <Box className="p-6 text-center">
              <Typography className="text-neutral-500 text-sm">
                새로운 알림이 없습니다.
              </Typography>
            </Box>
          ) : (
            notifications.map((notification, index) => (
              <NotificationItem
                key={`${notification.url}-${index}`}
                notification={notification}
                onPreCounselClick={handlePreCounselClickWithStateChange}
              />
            ))
          )}
        </List>

        {error && (
          <Box className="p-2 mt-2 bg-red-50 border border-red-200 rounded text-center">
            <Typography className="text-red-600 text-sm">{error}</Typography>
            <button
              onClick={handleErrorClose}
              className="text-red-500 text-xs underline mt-1"
            >
              닫기
            </button>
          </Box>
        )}
      </Box>

      <PreCounselDetailModal
        open={isSurveyDetailModalOpen}
        onClose={handleCloseModalWithStateChange}
        preCounselDetail={selectedPreCounsel}
        isLoading={isLoading}
      />
    </>
  );
}

export default NotificationList;

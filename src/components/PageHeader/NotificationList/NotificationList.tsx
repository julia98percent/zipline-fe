import { useCallback } from "react";
import { Box, Typography, List } from "@mui/material";
import type { Notification } from "@stores/useNotificationStore";
import PreCounselDetailModal from "@components/PreCounselDetailModal";
import { useNotification } from "@hooks/useNotification";
import { readAllNotification } from "@apis/notificationService";
import useNotificationStore from "@stores/useNotificationStore";
import Button from "@components/Button";
import NotificationItem from "./NotificationItem";
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

  const { updateNotification } = useNotificationStore();

  const handleModalStateChange = useCallback(
    (isOpen: boolean) => {
      onNotificationListModalStateChange?.(isOpen);
    },
    [onNotificationListModalStateChange]
  );

  const handlePreCounselClickWithStateChange = useCallback(
    async (uid: number) => {
      await handlePreCounselClick(uid);
      handleModalStateChange(true);
    },
    [handlePreCounselClick, handleModalStateChange]
  );

  const handleCloseModalWithStateChange = () => {
    handleCloseModal();
    handleModalStateChange(false);
  };

  const handleErrorClose = () => {
    resetError();
  };

  const handleReadAllNotifications = () => {
    readAllNotification(updateNotification);
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
        <div className="flex items-center justify-between text-gray-900 font-semibold mb-3 pb-2 border-b border-gray-200">
          <Typography variant="h6">알림</Typography>
          <Button
            text="모두 읽음 표시"
            className="p-0!"
            onClick={handleReadAllNotifications}
          />
        </div>
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
            notifications.map((notification) => (
              <NotificationItem
                key={`${notification.uid}`}
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

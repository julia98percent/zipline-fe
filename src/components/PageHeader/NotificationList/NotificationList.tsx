import { useCallback, useState } from "react";
import { Box, Typography, List } from "@mui/material";
import type { Notification } from "@stores/useNotificationStore";
import PreCounselDetailModal from "@components/PreCounselDetailModal";
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
  const [isSurveyDetailModalOpen, setIsSurveyDetailModalOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);

  const { updateNotification } = useNotificationStore();

  const handleModalStateChange = useCallback(
    (isOpen: boolean) => {
      onNotificationListModalStateChange?.(isOpen);
    },
    [onNotificationListModalStateChange]
  );

  const handlePreCounselClickWithStateChange = useCallback(
    async (uid: number) => {
      setSelectedSurveyId(uid);
      setIsSurveyDetailModalOpen(true);
      handleModalStateChange(true);
    },
    [handleModalStateChange]
  );

  const handleCloseModalWithStateChange = () => {
    setIsSurveyDetailModalOpen(false);
    setSelectedSurveyId(null);
    handleModalStateChange(false);
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
          width: "40vw",
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
      </Box>

      <PreCounselDetailModal
        open={isSurveyDetailModalOpen}
        onClose={handleCloseModalWithStateChange}
        surveyResponseUid={selectedSurveyId}
      />
    </>
  );
}

export default NotificationList;

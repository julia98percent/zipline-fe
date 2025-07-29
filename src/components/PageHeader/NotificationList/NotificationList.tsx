import { useCallback, useState } from "react";
import { Box, Typography, List } from "@mui/material";
import type { Notification } from "@stores/useNotificationStore";
import PreCounselDetailModal from "@components/PreCounselDetailModal";
import { readAllNotifications } from "@apis/notificationService";
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
    readAllNotifications();
  };

  return (
    <>
      <Box className="absolute top-15 -right-12 bg-white shadow-lg rounded-lg p-4 z-50 w-2/5 min-w-75 max-w-96 max-h-[50vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between text-gray-900 font-semibold mb-3 pb-2 border-b border-gray-200">
          <Typography variant="h6">알림</Typography>
          <Button
            variant="text"
            color="primary"
            onClick={handleReadAllNotifications}
          >
            모두 읽음 표시
          </Button>
        </div>
        <List className="p-0 flex-1 overflow-y-auto min-h-0 divide-y divide-gray-200">
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

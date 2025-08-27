import { useCallback, useState } from "react";
import { List } from "@mui/material";
import type { Notification } from "@stores/useNotificationStore";
import useNotificationStore from "@stores/useNotificationStore";
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
  const { setNotificationList } = useNotificationStore();

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

  const handleReadAllNotifications = async () => {
    try {
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      setNotificationList(updatedNotifications);

      // 서버에 읽음 처리 요청
      await readAllNotifications();
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);

      setNotificationList(notifications);
    }
  };

  return (
    <>
      <div className="absolute top-12 right-0 card z-50 w-[40vw] min-w-[300px] max-w-96 max-h-[50vh] overflow-hidden flex flex-col border border-neutral-100">
        <div className="py-2 px-3 flex items-center justify-between text-gray-900 font-semibold border-b border-gray-200">
          <h5 className="text-md">알림</h5>
          <Button
            variant="text"
            color="primary"
            onClick={handleReadAllNotifications}
          >
            모두 읽음 표시
          </Button>
        </div>
        <List className="flex flex-col flex-1 overflow-y-auto min-h-0 divide-y divide-neutral-200 gap-2 bg-neutral-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <h6 className="text-neutral-500 text-sm">
                새로운 알림이 없습니다.
              </h6>
            </div>
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
      </div>

      <PreCounselDetailModal
        open={isSurveyDetailModalOpen}
        onClose={handleCloseModalWithStateChange}
        surveyResponseUid={selectedSurveyId}
      />
    </>
  );
}

export default NotificationList;

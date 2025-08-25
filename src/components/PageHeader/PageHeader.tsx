import { IconButton, Badge } from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import { useSSE } from "@context/SSEContext";
import { Notifications } from "@mui/icons-material";
import NotificationList from "./NotificationList";
import useNotificationStore from "@stores/useNotificationStore";
import { fetchNotifications } from "@apis/notificationService";

interface PageHeaderProps {
  title: string;
  onMobileMenuToggle?: () => void;
}

const PageHeader = ({ title, onMobileMenuToggle }: PageHeaderProps) => {
  useSSE();
  const { notificationList, setNotificationList } = useNotificationStore();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount =
    notificationList?.filter((notification) => !notification.read).length || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isChildModalOpen) return;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen, isChildModalOpen]);

  const handleNotificationToggle = useCallback(() => {
    setIsNotificationOpen((prev) => !prev);
  }, []);

  const handleChildModalStateChange = useCallback((isOpen: boolean) => {
    setIsChildModalOpen(isOpen);
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        if (!notificationList) {
          const notifications = await fetchNotifications();
          setNotificationList(notifications);
        }
      } catch (error) {
        console.error("알림 데이터 로딩 실패:", error);
      }
    };

    loadNotifications();
  }, [notificationList, setNotificationList]);

  return (
    <div className="bg-white border-b border-gray-300 flex items-center justify-between h-18 px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="block md:hidden">
          <IconButton
            onClick={onMobileMenuToggle}
            className="text-gray-800 hover:bg-gray-50"
          >
            <MenuIcon />
          </IconButton>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div ref={notificationRef} className="relative">
          <IconButton
            onClick={handleNotificationToggle}
            className="text-black hover:bg-gray-50"
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {isNotificationOpen && (
            <NotificationList
              notifications={notificationList ?? []}
              onNotificationListModalStateChange={handleChildModalStateChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

import { IconButton, Badge } from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSSE } from "@context/SSEContext";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationList from "./NotificationList";
import useNotificationStore from "@stores/useNotificationStore";
import useMobileMenuStore from "@stores/useMobileMenuStore";
import { fetchNotifications } from "@apis/notificationService";
import { getPageBreadcrumb } from "@utils/pageUtils";

const PageHeader = () => {
  useSSE();
  const location = useLocation();
  const navigate = useNavigate();
  const { notificationList, setNotificationList } = useNotificationStore();
  const { toggle: toggleMobileMenu } = useMobileMenuStore();

  const breadcrumbs = getPageBreadcrumb(location.pathname);

  const isDashboard =
    location.pathname === "/" || location.pathname.startsWith("/dashboard");
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
    <div className="flex bg-neutral-50 items-center justify-between p-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="block md:hidden">
          <IconButton
            onClick={toggleMobileMenu}
            className="text-gray-800 hover:bg-gray-50"
          >
            <MenuIcon />
          </IconButton>
        </div>
        {!isDashboard && (
          <>
            <nav className="hidden sm:flex items-center gap-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <div
                  key={breadcrumb.path + index}
                  className="flex items-center gap-2"
                >
                  {index > 0 && (
                    <ChevronRightIcon className="text-gray-400 text-sm" />
                  )}

                  {index === 0 ? (
                    <button
                      onClick={() => navigate(breadcrumb.path)}
                      className="flex items-center hover:bg-gray-100 p-1 rounded transition-colors"
                    >
                      <HomeIcon
                        className={`text-lg ${
                          breadcrumb.isActive
                            ? "text-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(breadcrumb.path)}
                      className={`px-2 py-1 rounded transition-colors ${
                        breadcrumb.isActive
                          ? "text-gray-900 font-semibold text-lg"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                      disabled={
                        breadcrumb.isActive && index === breadcrumbs.length - 1
                      }
                    >
                      {breadcrumb.name}
                    </button>
                  )}
                </div>
              ))}
            </nav>

            <h1 className="sm:hidden text-xl font-semibold text-gray-900">
              {breadcrumbs.find((b) => b.isActive)?.name ||
                breadcrumbs[breadcrumbs.length - 1]?.name}
            </h1>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div ref={notificationRef} className="relative">
          <IconButton
            onClick={handleNotificationToggle}
            className="text-black hover:bg-gray-50"
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneIcon />
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

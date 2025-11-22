"use client";
import { IconButton, Badge, Button } from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSSE } from "@/context/SSEContext";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationList from "./NotificationList";
import UserMenu from "./UserMenu";
import useNotificationStore from "@/stores/useNotificationStore";
import useMobileMenuStore from "@/stores/useMobileMenuStore";
import useAuthStore from "@/stores/useAuthStore";
import { fetchNotifications } from "@/apis/notificationService";
import { getPageBreadcrumb } from "@/utils/pageUtils";

const PageHeader = () => {
  useSSE();
  const pathname = usePathname();
  const router = useRouter();
  const { notificationList, setNotificationList } = useNotificationStore();
  const { toggle: toggleMobileMenu } = useMobileMenuStore();
  const { user } = useAuthStore();

  const breadcrumbs = getPageBreadcrumb(pathname);

  const isDashboard = pathname === "/" || pathname.startsWith("/dashboard");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isNotificationOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen, isUserMenuOpen, isChildModalOpen]);

  const handleNotificationToggle = useCallback(() => {
    setIsNotificationOpen((prev) => !prev);
  }, []);

  const handleUserMenuToggle = useCallback(() => {
    setIsUserMenuOpen((prev) => !prev);
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
                      onClick={() => router.push(breadcrumb.path as Route)}
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
                      onClick={() => router.push(breadcrumb.path as Route)}
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

        <div ref={userMenuRef} className="relative">
          <Button
            onClick={handleUserMenuToggle}
            className="text-gray-800 hover:bg-gray-50 normal-case"
            endIcon={<KeyboardArrowDownIcon />}
          >
            <span className="text-sm font-medium">
              {user?.name || "사용자"} 님
            </span>
          </Button>

          {isUserMenuOpen && (
            <UserMenu onClose={() => setIsUserMenuOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

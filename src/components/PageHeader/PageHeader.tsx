import {
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@stores/useAuthStore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useSSE } from "@context/SSEContext";
import { Notifications } from "@mui/icons-material";
import NotificationList from "./NotificationList";
import useNotificationStore from "@stores/useNotificationStore";
import { fetchNotifications } from "@apis/notificationService";
import { logoutUser } from "@apis/userService";
import { clearAllAuthState } from "@utils/authUtil";
import Button from "@components/Button";

interface PageHeaderProps {
  title: string;
  onMobileMenuToggle?: () => void;
}

const PageHeader = ({ title, onMobileMenuToggle }: PageHeaderProps) => {
  useSSE();
  const { notificationList, setNotificationList } = useNotificationStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const navigate = useNavigate();
  const { user } = useAuthStore();

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

  const handleUserMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      handleUserMenuClose();
      clearAllAuthState();
      navigate("/sign-in");
    }
  };

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
    <Box className="bg-white border-b border-gray-300 flex items-center justify-between h-18 px-4 sticky top-0 z-50 shadow-sm">
      <Box className="flex items-center gap-4">
        {isMobile && (
          <IconButton
            onClick={onMobileMenuToggle}
            className="text-gray-800 hover:bg-gray-50"
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h5"
          component="h1"
          className={`font-bold text-gray-800 ${
            isMobile ? "absolute left-1/2 transform -translate-x-1/2" : ""
          }`}
        >
          {title}
        </Typography>
      </Box>

      <Box className="flex items-center gap-2">
        <Box ref={notificationRef} className="relative">
          <IconButton
            onClick={handleNotificationToggle}
            className="hover:bg-gray-50"
            style={{
              color: isNotificationOpen
                ? theme.palette.primary.main
                : "inherit",
            }}
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
        </Box>

        <Button
          onClick={handleUserMenuClick}
          variant="text"
          className="text-neutral-900 flex items-center gap-2"
          startIcon={<AccountCircleIcon />}
        >
          {user?.name || "사용자"}
        </Button>

        <Menu
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            className: "mt-2 shadow-md rounded-lg min-w-38",
          }}
        >
          <Link to="/my" style={{ textDecoration: "none", color: "inherit" }}>
            <MenuItem onClick={handleUserMenuClose}>마이페이지</MenuItem>
          </Link>
          <MenuItem onClick={handleLogout} className="text-red-600">
            로그아웃
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default PageHeader;

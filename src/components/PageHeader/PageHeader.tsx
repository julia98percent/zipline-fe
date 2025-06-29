import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Badge,
} from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@stores/useAuthStore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import apiClient from "@apis/apiClient";
import { useSSE } from "@context/SSEContext";
import { Notifications } from "@mui/icons-material";
import NotificationList from "./NotificationList";
import useNotificationStore from "@stores/useNotificationStore";
import { fetchNotifications } from "@apis/notificationService";
import { clearAllAuthState } from "@utils/authUtil";

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  useSSE();
  const { notificationList, setNotificationList } = useNotificationStore();

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
      await apiClient.post("/users/logout", {}, { withCredentials: true });
    } finally {
      handleUserMenuClose();
      clearAllAuthState();
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        if (!notificationList || notificationList.length === 0) {
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
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E0E0E0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "70px",
        px: 2,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: "bold", color: "#222222" }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box ref={notificationRef} sx={{ position: "relative" }}>
          <IconButton
            onClick={handleNotificationToggle}
            sx={{
              color: isNotificationOpen ? "primary.main" : "inherit",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
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
          sx={{
            color: "#222222",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
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
            sx: {
              mt: 1,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              minWidth: "150px",
            },
          }}
        >
          <Link to="/my" style={{ textDecoration: "none", color: "inherit" }}>
            <MenuItem onClick={handleUserMenuClose}>마이페이지</MenuItem>
          </Link>
          <MenuItem onClick={handleLogout} sx={{ color: "#d32f2f" }}>
            로그아웃
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default PageHeader;

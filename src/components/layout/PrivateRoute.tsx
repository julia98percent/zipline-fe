import { useEffect, useCallback, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";
import { fetchNotifications } from "@apis/notificationService";
import { Box, CircularProgress } from "@mui/material";
import useUserStore from "@stores/useUserStore";
import useNotificationStore from "@stores/useNotificationStore";
import { fetchUserInfo } from "@apis/userService";
import { clearAllAuthState } from "@utils/authUtil";
import useAuthStore from "@stores/useAuthStore";
import { SSEProvider } from "@context/SSEContext";

const PrivateRoute = () => {
  const { user, setUser } = useUserStore();
  const { isSignedIn, checkAuth } = useAuthStore();
  const { setNotificationList } = useNotificationStore();

  const isInitializingRef = useRef(false);

  const handleAuthFailure = useCallback(() => {
    clearAllAuthState();
  }, []);

  const initializeUserData = useCallback(async () => {
    if (isInitializingRef.current) return;

    isInitializingRef.current = true;

    try {
      const [userData, notifications] = await Promise.all([
        fetchUserInfo(),
        fetchNotifications(),
      ]);

      setUser(userData as Parameters<typeof setUser>[0]);
      setNotificationList(notifications);
    } catch (error) {
      console.error("사용자 데이터 초기화 실패:", error);
      handleAuthFailure();
    } finally {
      isInitializingRef.current = false;
    }
  }, [setUser, setNotificationList, handleAuthFailure]);

  useEffect(() => {
    if (isSignedIn === null) {
      checkAuth();
    } else if (isSignedIn && !user && !isInitializingRef.current) {
      initializeUserData();
    } else if (isSignedIn === false) {
      handleAuthFailure();
    }
  }, [isSignedIn, user, checkAuth, handleAuthFailure, initializeUserData]);

  if (isSignedIn === false) {
    return <Navigate to="/sign-in" replace />;
  }

  if (isSignedIn && !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <SSEProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100vh",
        }}
      >
        <NavigationBar />
        <Box sx={{ width: "100%", backgroundColor: "#f5f5f5", flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </SSEProvider>
  );
};

export default PrivateRoute;

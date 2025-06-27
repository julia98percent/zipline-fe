import { useEffect, useState, useCallback } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";
import { fetchNotifications } from "@apis/notificationService";
import { Box, CircularProgress } from "@mui/material";
import useUserStore from "@stores/useUserStore";
import { fetchUserInfo } from "@apis/userService";
import useNotificationStore from "@stores/useNotificationStore";
import { clearAllAuthState } from "@utils/authUtil";
import useAuthStore from "@stores/useAuthStore";
import { SSEProvider } from "@context/SSEContext";

const PrivateRoute = () => {
  const { user, setUser } = useUserStore();
  const { isSignedIn, checkAuth } = useAuthStore();

  const { setNotificationList } = useNotificationStore();
  const [isInitializing, setIsInitializing] = useState(false);

  const isReady = isSignedIn && user && !isInitializing;

  const handleAuthFailure = useCallback(() => {
    clearAllAuthState();
  }, []);

  const initializeUserData = useCallback(async () => {
    if (isInitializing) return;

    setIsInitializing(true);
    try {
      const userFetched = await fetchUserInfo(setUser);
      if (userFetched) {
        await fetchNotifications(setNotificationList);
      }
    } catch (error) {
      console.error("사용자 데이터 초기화 실패:", error);
      handleAuthFailure();
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, setUser, setNotificationList, handleAuthFailure]);

  useEffect(() => {
    if (isSignedIn === null) {
      checkAuth();
    } else if (isSignedIn && !user && !isInitializing) {
      initializeUserData();
    } else if (isSignedIn === false) {
      handleAuthFailure();
    }
  }, [isSignedIn, user, isInitializing]);

  if (isSignedIn === false) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!isReady) {
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

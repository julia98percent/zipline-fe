import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";
import { fetchNotifications } from "@apis/notificationService";
import { Box, CircularProgress } from "@mui/material";
import useUserStore from "@stores/useUserStore";
import { fetchUserInfo } from "@apis/userService";
import useNotificationStore from "@stores/useNotificationStore";

const STORAGE_KEY = "_ZA";

const PrivateRoute = () => {
  const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const { setNotificationList } = useNotificationStore();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const clearUserSession = () => {
    sessionStorage.clear();
    clearUser();
  };

  const handleAuthError = () => {
    clearUserSession();
    setShouldRedirect(true);
    setIsLoading(false);
  };

  const initializeAuth = async () => {
    const token = sessionStorage.getItem(STORAGE_KEY);

    if (!token) {
      handleAuthError();
      return;
    }

    if (user) {
      setIsLoading(false);
      return;
    }

    try {
      const userFetched = await fetchUserInfo(setUser);
      if (userFetched) {
        await fetchNotifications(setNotificationList);
      }
    } catch {
      handleAuthError();
      return;
    }

    setIsLoading(false);
  };

  useEffect(() => {
    initializeAuth();
  }, [user]); // 의존성 배열 단순화

  if (shouldRedirect) {
    return <Navigate to="/sign-in" />;
  }

  if (isLoading || !user) {
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
  );
};

export default PrivateRoute;

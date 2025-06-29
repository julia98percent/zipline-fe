import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";
import { Box, CircularProgress } from "@mui/material";
import { clearAllAuthState } from "@utils/authUtil";
import useAuthStore from "@stores/useAuthStore";
import { SSEProvider } from "@context/SSEContext";

const PrivateRoute = () => {
  const { user, isSignedIn, checkAuth } = useAuthStore();

  useEffect(() => {
    if (isSignedIn === null) {
      checkAuth();
    }
  }, [isSignedIn, checkAuth]);

  useEffect(() => {
    if (isSignedIn === false) {
      clearAllAuthState();
    }
  }, [isSignedIn]);

  if (isSignedIn === false) {
    return <Navigate to="/sign-in" replace />;
  }

  if (isSignedIn === null || (isSignedIn && !user)) {
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

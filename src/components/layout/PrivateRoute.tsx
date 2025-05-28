import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";
import apiClient from "@apis/apiClient";
import { Box, CircularProgress } from "@mui/material";
import useUserStore from "@stores/useUserStore";

const PrivateRoute = () => {
  const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("_ZA");

    if (!token) {
      sessionStorage.clear();
      clearUser();
      setShouldRedirect(true);
      setIsLoading(false);
      return;
    }

    if (!user) {
      apiClient
        .get("/users/info")
        .then((res) => {
          const userData = res?.data?.data;
          if (res && res.status === 200 && userData) {
            setUser(userData);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          clearUser();
          sessionStorage.removeItem("_ZA");
          setShouldRedirect(true);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user, setUser, clearUser]);

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

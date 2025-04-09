import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";
import apiClient from "@apis/apiClient";
import { Box, CircularProgress } from "@mui/material";
import useUserStore from "@stores/useUserStore";

const PrivateRoute = () => {
  const isSignedIn = Boolean(sessionStorage.getItem("_ZA"));
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (isSignedIn && !user) {
      apiClient
        .get("/users/me")
        .then((res) => {
          const userData = res?.data?.data;
          if (res && res.status === 200 && userData) {
            setUser(userData);
          }
        })
        .catch((error) => {
          console.log(error);
          sessionStorage.removeItem("_ZA");
        });
    }
  }, [isSignedIn, user, setUser]);

  if (!isSignedIn) {
    localStorage.clear();
    return <Navigate to="/sign-in" />;
  }

  if (!user) {
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
    <>
      <NavigationBar userName={user.name} />
      <div className="flex-1">
        <Outlet />
      </div>
    </>
  );
};

export default PrivateRoute;

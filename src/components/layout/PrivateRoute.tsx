import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";
import apiClient from "@apis/apiClient";
import { Box, CircularProgress } from "@mui/material";

const PrivateRoute = () => {
  const isSignedIn = Boolean(sessionStorage.getItem("_ZA"));
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    apiClient
      .get("/users/me")
      .then((res) => {
        const userData = res?.data?.data;
        if (res && res.status === 200 && userData) {
          setUserInfo(userData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!isSignedIn) {
    localStorage.clear();
    return <Navigate to="/sign-in" />;
  }

  if (!userInfo)
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

  return (
    <>
      <NavigationBar userInfo={userInfo} />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </>
  );
};

export default PrivateRoute;

import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";

const PrivateRoute = () => {
  const isSignedIn = Boolean(sessionStorage.getItem("_ZA"));
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (userInfo == null) {
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/user/me`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("_ZA") || ""}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const userData = res?.data?.data;
          if (res.status === 200 && userData) {
            setUserInfo(userData);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userInfo]);

  if (!isSignedIn) {
    localStorage.clear();
    return <Navigate to="/sign-in" />;
  }

  if (!userInfo) return <div>loading ...</div>;

  return (
    <>
      <NavigationBar userInfo={userInfo} />
      <div className="flex-1">
        <Outlet />
      </div>
    </>
  );
};

export default PrivateRoute;

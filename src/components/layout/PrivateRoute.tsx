import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";
import { CircularProgress } from "@mui/material";
import { clearAllAuthState } from "@utils/authUtil";
import useAuthStore from "@stores/useAuthStore";
import { SSEProvider } from "@context/SSEContext";

const PrivateRoute = () => {
  const { user, isSignedIn, checkAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

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
      <div className="flex justify-center items-center h-screen">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <SSEProvider>
      <div className="flex flex-row w-full h-screen">
        <NavigationBar
          mobileOpen={mobileOpen}
          onMobileClose={handleMobileClose}
        />
        <div className="flex-1 bg-gray-100 min-w-0 overflow-x-hidden">
          <Outlet context={{ onMobileMenuToggle: handleMobileMenuToggle }} />
        </div>
      </div>
    </SSEProvider>
  );
};

export default PrivateRoute;

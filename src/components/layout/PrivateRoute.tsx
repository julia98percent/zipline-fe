import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NavigationBar from "@components/NavigationBar";
import CircularProgress from "@components/CircularProgress";
import { clearAllAuthState } from "@utils/authUtil";
import useAuthStore from "@stores/useAuthStore";
import useMobileMenuStore from "@stores/useMobileMenuStore";
import { SSEProvider } from "@context/SSEContext";

const PrivateRoute = () => {
  const { user, isSignedIn, checkAuth } = useAuthStore();
  const { isOpen: mobileOpen, close: handleMobileClose } = useMobileMenuStore();

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
        <CircularProgress />
      </div>
    );
  }

  return (
    <SSEProvider>
      <div className="relative flex flex-row w-full h-screen">
        <NavigationBar
          mobileOpen={mobileOpen}
          onMobileClose={handleMobileClose}
        />
        <div
          className="flex-1 bg-neutral-50 min-w-0 overflow-x-hidden"
          style={{ scrollbarGutter: "stable" }}
        >
          <Outlet />
        </div>
      </div>
    </SSEProvider>
  );
};

export default PrivateRoute;

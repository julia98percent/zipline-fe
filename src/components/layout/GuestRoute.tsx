import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "@stores/useAuthStore";

const GuestRoute = () => {
  const { isSignedIn } = useAuthStore();
  if (isSignedIn === true) return <Navigate to="/" replace />;

  return (
    <div className="overflow-y-scroll h-full">
      <Outlet />
    </div>
  );
};

export default GuestRoute;

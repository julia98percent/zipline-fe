import { Outlet, Navigate } from "react-router-dom";

const GuestRoute = () => {
  const isSignedIn = Boolean(sessionStorage.getItem("_ZA"));

  if (isSignedIn) return <Navigate to="/" replace />;

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default GuestRoute;

import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isSignedIn = Boolean(sessionStorage.getItem("_ZA"));

  if (!isSignedIn) {
    localStorage.clear();
    return <Navigate to="/sign-in" />;
  }

  return (
    <>
      <div className="flex-1">
        <Outlet />
      </div>
    </>
  );
};

export default PrivateRoute;

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import CircularProgress from "@/components/CircularProgress";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn === null) {
      checkAuth();
    }
  }, [isSignedIn, checkAuth]);

  useEffect(() => {
    if (isSignedIn === true) {
      router.replace("/");
    }
  }, [isSignedIn, router]);

  if (isSignedIn === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (isSignedIn === true) {
    return null;
  }

  return <>{children}</>;
};
export default GuestRoute;

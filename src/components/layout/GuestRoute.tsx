"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn === true) {
      router.replace("/");
    }
  }, [isSignedIn, router]);

  if (isSignedIn === true) {
    return null;
  }

  return <>{children}</>;
};
export default GuestRoute;

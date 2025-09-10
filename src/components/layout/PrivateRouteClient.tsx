"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/NavigationBar";
import CircularProgress from "@/components/CircularProgress";
import PageHeader from "@/components/PageHeader";
import { clearAllAuthState } from "@/utils/authUtil";
import useAuthStore from "@/stores/useAuthStore";
import useMobileMenuStore from "@/stores/useMobileMenuStore";
import { SSEProvider } from "@/context/SSEContext";

interface PrivateRouteClientProps {
  children: React.ReactNode;
}

const PrivateRouteClient = ({ children }: PrivateRouteClientProps) => {
  const router = useRouter();
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

  useEffect(() => {
    if (isSignedIn === false) {
      router.replace("/sign-in");
    }
  }, [isSignedIn, router]);

  if (isSignedIn === null || (isSignedIn && !user)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <SSEProvider>
      <NavigationBar
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />
      <div className="flex-1 bg-neutral-50 min-w-0 overflow-x-hidden">
        <PageHeader />
        {children}
      </div>
    </SSEProvider>
  );
};

export default PrivateRouteClient;

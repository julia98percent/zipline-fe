"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { loginUser } from "@/apis/userService";
import { fetchDashboardStatistics } from "@/apis/statisticsService";
import { fetchSchedulesByDateRange } from "@/apis/scheduleService";
import { fetchSubmittedSurveyResponses } from "@/apis/preCounselService";
import { fetchDashboardCounsels } from "@/apis/counselService";
import {
  fetchExpiringContractsForDashboard,
  fetchRecentContractsForDashboard,
} from "@/apis/contractService";
import useInput from "@/hooks/useInput";
import UserIdInput from "./UserIdInput";
import PasswordInput from "./PasswordInput";
import AuthLinks from "./AuthLinks";
import EntryImage from "@/components/EntryImage";
import Button from "@/components/Button";
import { showToast } from "@/components/Toast";
import useAuthStore from "@/stores/useAuthStore";
import { USER_ERROR_MESSAGES } from "@/constants/clientErrorMessage";
import Image from "next/image";
import type { Route } from "next";

const SignInPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { checkAuth } = useAuthStore();

  const [userId, handleChangeUserId] = useInput("");
  const [password, handleChangePassword] = useInput("");
  const [isLoading, setIsLoading] = useState(false);

  const isSignInButtonDisabled = !userId || !password || isLoading;

  const handleClickSignInButton = async (
    userIdParam?: string,
    passwordParam?: string
  ) => {
    const loginUserId = userIdParam ?? userId;
    const loginPassword = passwordParam ?? password;

    setIsLoading(true);
    try {
      const res = await loginUser(loginUserId, loginPassword);

      if (res.status === 200) {
        await checkAuth();

        const { isSignedIn } = useAuthStore.getState();

        if (isSignedIn) {
          const today = new Date();
          const startDate = dayjs(today).startOf("week").toISOString();
          const endDate = dayjs(today).endOf("week").toISOString();

          try {
            await Promise.all([
              queryClient.prefetchQuery({
                queryKey: ["dashboardStatistics"],
                queryFn: fetchDashboardStatistics,
              }),
              queryClient.prefetchQuery({
                queryKey: ["schedules", startDate, endDate],
                queryFn: () =>
                  fetchSchedulesByDateRange({ startDate, endDate }),
              }),
              queryClient.prefetchQuery({
                queryKey: ["surveyResponses", 0, 10],
                queryFn: () => fetchSubmittedSurveyResponses(0, 10),
              }),
              queryClient.prefetchQuery({
                queryKey: ["counsels", "DUE_DATE", 0, 5],
                queryFn: () =>
                  fetchDashboardCounsels({
                    sortType: "DUE_DATE",
                    page: 0,
                    size: 5,
                  }),
              }),
              queryClient.prefetchQuery({
                queryKey: ["counsels", "LATEST", 0, 5],
                queryFn: () =>
                  fetchDashboardCounsels({
                    sortType: "LATEST",
                    page: 0,
                    size: 5,
                  }),
              }),
              queryClient.prefetchQuery({
                queryKey: ["contracts", "expiring", 0, 5],
                queryFn: () => fetchExpiringContractsForDashboard(0, 5),
              }),
              queryClient.prefetchQuery({
                queryKey: ["contracts", "recent", 0, 5],
                queryFn: () => fetchRecentContractsForDashboard(0, 5),
              }),
            ]);
            console.log("[SignIn] Dashboard data prefetch completed");
          } catch (prefetchError) {
            console.warn("[SignIn] Dashboard prefetch failed:", prefetchError);
            // Continue with redirect even if prefetch fails
          }
        }

        if (isSignedIn) {
          showToast({
            message: "로그인에 성공했습니다.",
            type: "success",
          });

          const redirectPath = localStorage.getItem("redirectAfterLogin");
          let cookieReady = false;
          const maxAttempts = 10;
          const delayMs = 500;

          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            console.log(
              `[SignIn] Cookie check attempt ${attempt + 1}/${maxAttempts}`
            );

            // Wait before checking
            if (attempt > 0) {
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }

            // Check if cookies work by calling checkAuth again
            await checkAuth();
            const { isSignedIn: stillSignedIn } = useAuthStore.getState();

            if (stillSignedIn) {
              console.log(
                "[SignIn] ✅ Cookies verified, proceeding with redirect"
              );
              cookieReady = true;
              break;
            }
          }

          if (!cookieReady) {
            console.error(
              "[SignIn] ❌ Cookie propagation timeout, redirecting anyway"
            );
          }

          if (redirectPath) {
            // Only redirect if there's a saved path
            localStorage.removeItem("redirectAfterLogin");
            router.replace(redirectPath as Route);
          } else {
            console.log("[SignIn] No redirect path, redirecting to dashboard");
            router.replace("/");
          }
        } else {
          console.error(
            "[SignIn] ❌ Login succeeded but checkAuth failed - cookie not set properly"
          );
          router.replace("/");
        }
      }
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>;
      const serverMessage =
        error.response?.data?.message || USER_ERROR_MESSAGES.LOGIN_FAILED;

      showToast({
        message: serverMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSignInButtonDisabled) {
      handleClickSignInButton();
    }
  };

  return (
    <div className="h-full flex">
      <EntryImage />
      <div className="flex flex-col w-full md:w-1/2 flex items-center justify-center">
        <h1 className="hidden md:block font-bold text-primary text-2xl">
          로그인
        </h1>
        <div className="w-full flex-col flex items-center justify-center">
          {/* Mobile Header - Mobile Only */}
          <div className="flex items-center md:hidden text-center">
            <Image
              src={"/assets/logo.png"}
              alt="ZIPLINE Logo"
              width={48}
              height={48}
              className="w-12 h-12 mr-2"
            />
            <h3 className="text-2xl font-bold text-blue-800 text-primary">
              ZIPLINE
            </h3>
          </div>

          <div className="w-full max-w-4/5 sm:max-w-2/3 md:max-w-[400px] p-4">
            <div className="mt-6 flex flex-col gap-6">
              <UserIdInput
                userId={userId}
                handleChangeUserId={handleChangeUserId}
                onKeyDown={handleKeyDown}
              />
              <PasswordInput
                password={password}
                handleChangePassword={handleChangePassword}
                onKeyDown={handleKeyDown}
              />
              <Button
                color="primary"
                fullWidth
                onClick={() => handleClickSignInButton()}
                disabled={isSignInButtonDisabled}
                className="h-[46px]"
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "로그인"
                )}
              </Button>
            </div>

            <Button
              className="mt-2 w-full h-[46px]"
              variant="outlined"
              onClick={() => {
                handleClickSignInButton("test01", "test012!");
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                "테스트 계정으로 로그인"
              )}
            </Button>

            <div className="flex justify-center items-center mt-4 gap-2">
              <AuthLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

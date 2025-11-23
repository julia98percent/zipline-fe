"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { loginUser } from "@/apis/userService";
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
        console.log("[SignIn] Login API successful, calling checkAuth...");
        await checkAuth();

        const { isSignedIn } = useAuthStore.getState();
        console.log("[SignIn] checkAuth completed, isSignedIn:", isSignedIn);

        if (isSignedIn) {
          showToast({
            message: "로그인에 성공했습니다.",
            type: "success",
          });

          const redirectPath = localStorage.getItem("redirectAfterLogin");
          console.log("[SignIn] Redirecting to:", redirectPath || "/");
          router.replace((redirectPath || "/") as Route);
        } else {
          console.error("[SignIn] ❌ Login succeeded but checkAuth failed - cookie not set properly");
          showToast({
            message: "로그인은 성공했지만 세션 설정에 실패했습니다. 쿠키 설정을 확인해주세요.",
            type: "error",
          });
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

import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@apis/userService";
import useInput from "@hooks/useInput";
import { UserIdInput, PasswordInput, AuthLinks } from "./components";
import Button from "@components/Button";
import { Box, Typography } from "@mui/material";
import { showToast } from "@components/Toast";
import useAuthStore from "@stores/useAuthStore";
import { USER_ERROR_MESSAGES } from "@constants/clientErrorMessage";
import Logo from "@assets/logo.png";
import EntryImage from "@components/EntryImage";

const SignInPage = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  const [userId, handleChangeUserId] = useInput("");
  const [password, handleChangePassword] = useInput("");

  const isSignInButtonDisabled = !userId || !password;

  const handleClickSignInButton = async () => {
    try {
      const res = await loginUser(userId, password);

      if (res.status === 200) {
        await checkAuth();

        showToast({
          message: "로그인에 성공했습니다.",
          type: "success",
        });

        const redirectPath = localStorage.getItem("redirectAfterLogin");
        navigate(redirectPath || "/");
      }
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>;
      const serverMessage =
        error.response?.data?.message || USER_ERROR_MESSAGES.LOGIN_FAILED;

      showToast({
        message: serverMessage,
        type: "error",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSignInButtonDisabled) {
      handleClickSignInButton();
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="h-full flex">
        <EntryImage />
        <div className="flex flex-col w-full md:w-1/2 flex items-center justify-center">
          <h1 className="hidden md:block font-bold text-primary text-2xl">
            로그인
          </h1>
          <div className="w-full flex-col flex items-center justify-center">
            {/* Mobile Header - Mobile Only */}
            <div className="flex items-center md:hidden text-center">
              <img src={Logo} alt="ZIPLINE Logo" className="w-12 h-12 mr-2" />
              <h3 className="text-2xl font-bold text-blue-800 text-primary">
                ZIPLINE
              </h3>
            </div>

            <div className="w-full max-w-4/5 p-4">
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
                  onClick={handleClickSignInButton}
                  disabled={isSignInButtonDisabled}
                  className="h-[46px]"
                >
                  로그인
                </Button>
              </div>

              <Box className="flex flex-col items-center mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  className="mb-2"
                >
                  테스트 계정
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: test01
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Password: test1234!
                </Typography>
              </Box>

              <Box className="flex justify-center items-center mt-4 gap-2">
                <AuthLinks />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

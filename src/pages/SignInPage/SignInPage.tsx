import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@apis/userService";
import useInput from "@hooks/useInput";
import { Header, UserIdInput, PasswordInput, AuthLinks } from "./components";
import Button from "@components/Button";
import { Box, Typography } from "@mui/material";
import signInImage from "@assets/sign-up.png";
import { showToast } from "@components/Toast";
import useAuthStore from "@stores/useAuthStore";
import { USER_ERROR_MESSAGES } from "@constants/clientErrorMessage";

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
        {/* Left Panel - Only visible on wider screens */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#164F9E] to-[#0D3B7D] items-center justify-center">
          <div className="text-white text-center p-6">
            <img
              src={signInImage}
              alt="공인중개사 CRM 서비스"
              className="w-96 mx-auto mb-8"
            />
            <Typography variant="h4" component="h1" className="font-bold mb-2">
              Zip-line
            </Typography>
            <Typography variant="h6" className="opacity-90">
              흩어진 중개 업무, 여기서 전부 관리해요!
            </Typography>
          </div>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md p-4">
            <Header />
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
            </div>

            <Button
              color="primary"
              fullWidth
              onClick={handleClickSignInButton}
              disabled={isSignInButtonDisabled}
              className="mt-8 h-[46px]"
            >
              로그인
            </Button>

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
  );
};

export default SignInPage;

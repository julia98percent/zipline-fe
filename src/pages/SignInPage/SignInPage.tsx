import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@apis/userService";
import useInput from "@hooks/useInput";
import { Header, UserIdInput, PasswordInput } from "./components";
import Button from "@components/Button";
import { Box, Typography } from "@mui/material";
import signInImage from "@assets/sign-up.png";
import { showToast } from "@components/Toast/Toast";
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

        navigate("/");
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
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              Zip-line
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
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
              className="mt-8 h-[46px] rounded-lg text-base transition-all duration-200 ease-in-out"
            >
              로그인
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 3,
                p: 2,
                backgroundColor: "#F9FAFB",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                회원이 아니신가요?
              </Typography>
              <Link to="/sign-up" className="flex items-center">
                <Button variant="text" className="m-0 p-0 font-bold">
                  회원가입
                </Button>
              </Link>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

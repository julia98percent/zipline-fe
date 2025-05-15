import apiClient from "@apis/apiClient";
import { Link, useNavigate } from "react-router-dom";
import useInput from "@hooks/useInput";
import Header from "./Header";
import UserIdInput from "./UserIdInput";
import PasswordInput from "./PasswordInput";
import Button from "@components/Button";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import signInImage from "@assets/sign-up.png";
import { showToast } from "@components/Toast/Toast";

const SignInPage = () => {
  const navigate = useNavigate();
  const [userId, handleChangeUserId] = useInput("");
  const [password, handleChangePassword] = useInput("");

  const isSignInButtonDisabled = !userId || !password;

  const handleClickSignInButton = () => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = crypto.randomUUID(); // 브라우저에서 UUID 생성
      localStorage.setItem("deviceId", deviceId);
    }

    apiClient
      .post(
        "/users/login",
        {
          id: userId,
          password,
        },
        {
          headers: {
            "X-Device-Id": deviceId,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        const accessToken = res?.data?.data?.accessToken;
        if (res.status === 200 && accessToken) {
          sessionStorage.setItem("_ZA", accessToken);
          showToast({
            message: "로그인에 성공했습니다.",
            type: "success",
          });
          navigate("/");
        }
      })
      .catch((error) => {
        const serverMessage =
          error.response?.data?.message || "로그인 중 오류가 발생했습니다.";
        showToast({
          message: serverMessage,
          type: "error",
        });
        console.log(error);
      });
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
              text="로그인"
              onClick={handleClickSignInButton}
              disabled={isSignInButtonDisabled}
              sx={{
                marginTop: "32px",
                width: "100%",
                color: "white",
                minHeight: "40px",
                backgroundColor: "#164F9E",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#0D3B7D",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  backgroundColor: "#E5E7EB",
                  color: "#9CA3AF",
                  transform: "none",
                },
              }}
            />

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
                <Button
                  text="회원가입"
                  sx={{
                    color: "#164F9E",
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "0",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                />
              </Link>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

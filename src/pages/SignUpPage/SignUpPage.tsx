import apiClient from "@apis/apiClient";
import { useNavigate, Link } from "react-router-dom";
import useInput from "@hooks/useInput";
import Header from "./Header";
import NameInput from "./NameInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import Button from "@components/Button";
import PhoneNumberInput from "./PhoneNumberInput";
import UserIdInput from "./UserIdInput";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signUpImage from "@assets/sign-up.png";

const isValidUserId = (id: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/.test(id);

const isValidPassword = (pw: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/.test(
    pw
  );

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhoneNumber = (phone: string) =>
  /^01[0|1|6|7|8|9]-\d{3,4}-\d{4}$/.test(phone);

const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, handleChangeName] = useInput("");
  const [userId, handleChangeUserId] = useInput("");
  const [email, handleChangeEmail] = useInput("");
  const [phoneNumber, handleChangePhoneNumber] = useInput("");
  const [password, handleChangePassword] = useInput("");
  const [passwordCheck, handleChangePasswordCheck] = useInput("");

  const isSignUpButtonDisabled =
    name == "" ||
    userId == "" ||
    !email ||
    !password ||
    !passwordCheck ||
    !phoneNumber;

  const handleClickSignUpButton = () => {
    if (!isValidUserId(userId)) {
      toast.error("아이디는 영문과과 숫자를 포함해 4~12자로 입력해주세요.");
      return;
    }
    if (!isValidPassword(password)) {
      toast.error(
        "비밀번호는 영문, 숫자, 특수문자를 포함해 8~20자로 입력해주세요."
      );
      return;
    }
    if (password !== passwordCheck) {
      toast.error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("유효한 이메일 형식을 입력해주세요. 예: example@domain.com");
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error("전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678");
      return;
    }
    apiClient
      .post("/users/signup", {
        id: userId,
        password,
        passwordCheck,
        name,
        phoneNo: phoneNumber,
        email,
        noticeMonth: 0,
      })
      .then((res) => {
        if (res.status === 201) {
          toast.success("회원가입에 성공했습니다.");
          navigate("/sign-in");
        }
      })
      .catch((error) => {
        const msg = error.response?.data?.message;
        toast.error(msg || "회원가입 중 오류가 발생했습니다.");
        console.log(error);
      });
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="h-full flex">
        {/* Left Panel - Only visible on wider screens */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#164F9E] to-[#0D3B7D] items-center justify-center">
          <div className="text-white text-center p-6">
            <img
              src={signUpImage}
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

        {/* Right Panel - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md p-4">
            <Header />
            <div className="mt-6 flex flex-col gap-6">
              <NameInput name={name} handleChangeName={handleChangeName} />
              <UserIdInput
                userId={userId}
                handleChangeUserId={handleChangeUserId}
              />
              <EmailInput email={email} handleChangeEmail={handleChangeEmail} />
              <PasswordInput
                password={password}
                passwordCheck={passwordCheck}
                handleChangePassword={handleChangePassword}
                handleChangePasswordCheck={handleChangePasswordCheck}
              />
              <PhoneNumberInput
                phoneNumber={phoneNumber}
                handleChangePhoneNumber={handleChangePhoneNumber}
              />
            </div>

            <Button
              text="가입하기"
              onClick={handleClickSignUpButton}
              disabled={isSignUpButtonDisabled}
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
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                이미 회원이신가요?
              </Typography>
              <Link to="/sign-in" className="flex items-center">
                <Button
                  text="로그인"
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

export default SignUpPage;

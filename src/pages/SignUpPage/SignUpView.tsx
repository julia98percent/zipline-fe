import { Link } from "react-router-dom";
import Button from "@components/Button";
import {
  NameInput,
  EmailInput,
  PasswordInput,
  PhoneNumberInput,
  UserIdInput,
} from "./components";
import { Typography } from "@mui/material";

interface SignUpViewProps {
  formData: {
    name: string;
    userId: string;
    email: string;
    phoneNumber: string;
    password: string;
    passwordCheck: string;
  };
  handlers: {
    handleChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeUserId: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangePhoneNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangePasswordCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  eventHandlers: {
    handleBlur: (field: string, value: string) => void;
    handleSubmit: () => void;
  };
  isFormValid: boolean;
}

const SignUpView = ({
  formData,
  handlers,
  eventHandlers,
  isFormValid,
}: SignUpViewProps) => {
  const { name, userId, email, phoneNumber, password, passwordCheck } =
    formData;

  const {
    handleChangeName,
    handleChangeUserId,
    handleChangeEmail,
    handleChangePhoneNumber,
    handleChangePassword,
    handleChangePasswordCheck,
  } = handlers;

  const { handleBlur, handleSubmit } = eventHandlers;

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
            <Typography variant="h4" component="h1" className="font-bold mb-2">
              ZIPLINE
            </Typography>
            <Typography variant="h6" className="opacity-90">
              흩어진 중개 업무, 여기서 전부 관리해요!
            </Typography>
          </div>
        </div>

        {/* Right Panel - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md p-3">
            <Typography
              variant="h5"
              component="h2"
              className="font-bold mb-4 text-center text-primary"
            >
              회원가입
            </Typography>
            <div className="flex flex-col gap-4">
              <NameInput
                name={name}
                handleChangeName={handleChangeName}
                onBlur={() => handleBlur("name", name)}
              />
              <UserIdInput
                userId={userId}
                handleChangeUserId={handleChangeUserId}
                onBlur={() => handleBlur("userId", userId)}
              />
              <EmailInput
                email={email}
                handleChangeEmail={handleChangeEmail}
                onBlur={() => handleBlur("email", email)}
              />
              <PasswordInput
                password={password}
                passwordCheck={passwordCheck}
                handleChangePassword={handleChangePassword}
                handleChangePasswordCheck={handleChangePasswordCheck}
              />
              <PhoneNumberInput
                phoneNumber={phoneNumber}
                handleChangePhoneNumber={handleChangePhoneNumber}
                onBlur={() => handleBlur("phoneNumber", phoneNumber)}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              color="primary"
              fullWidth
              className="mt-5 h-[46px]"
            >
              가입하기
            </Button>

            <Box className="flex justify-center items-center mt-4 gap-2">
              <Typography variant="body2" color="text.secondary">
                이미 회원이신가요?
              </Typography>
              <Link to="/sign-in" className="flex items-center">
                <Button variant="text" className="m-0 p-0 font-bold">
                  로그인
                </Button>
              </Link>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpView;

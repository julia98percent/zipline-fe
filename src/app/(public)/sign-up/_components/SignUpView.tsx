import Link from "next/link";
import Button from "@/components/Button";
import NameInput from "./NameInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import PhoneNumberInput from "./PhoneNumberInput";
import UserIdInput from "./UserIdInput";
import { Typography } from "@mui/material";
import Image from "next/image";
import EntryImage from "@/components/EntryImage";

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
    <div className="my-10 md:my-0 h-full">
      <div className="flex">
        <EntryImage />

        <div className="flex flex-col w-full md:w-1/2 flex items-center justify-center">
          <h1 className="hidden md:block font-bold text-primary text-2xl">
            회원가입
          </h1>
          <div className="w-full flex-col flex items-center justify-center">
            <div className="flex items-center md:hidden text-center">
              <Image
                src="/assets/logo.png"
                alt="ZIPLINE Logo"
                width={48}
                height={48}
                className="w-12 h-12 mr-2"
              />
              <h3 className="text-2xl font-bold text-blue-800 text-primary">
                ZIPLINE
              </h3>
            </div>

            <div className="w-full max-w-4/5 md:max-w-3/5 mt-6 flex flex-col gap-6">
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

              <Button
                onClick={handleSubmit}
                disabled={!isFormValid}
                color="primary"
                fullWidth
                className="h-[46px]"
              >
                회원가입
              </Button>
            </div>

            <div className="flex justify-center items-center mt-4 gap-2">
              <Typography variant="body2" color="text.secondary">
                이미 회원이신가요?
              </Typography>
              <Link href="/sign-in" className="flex items-center">
                <Button variant="text" className="m-0 p-0 font-bold">
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpView;

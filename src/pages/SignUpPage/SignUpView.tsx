import { Link } from "react-router-dom";
import Button from "@components/Button";
import {
  NameInput,
  EmailInput,
  PasswordInput,
  PhoneNumberInput,
  UserIdInput,
} from "./components";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import signUpImage from "@assets/sign-up.png";

interface SignUpViewProps {
  formData: {
    name: string;
    userId: string;
    email: string;
    phoneNumber: string;
    password: string;
    passwordCheck: string;
    passwordQuestionUid: string;
    questionAnswer: string;
  };
  handlers: {
    handleChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeUserId: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangePhoneNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangePasswordCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setPasswordQuestionUid: (value: string) => void;
    setQuestionAnswer: (value: string) => void;
  };
  eventHandlers: {
    handleBlur: (field: string, value: string) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    handleSubmit: () => void;
  };
  isFormValid: boolean;
  PASSWORD_QUESTIONS: Array<{ uid: number; question: string }>;
}

const SignUpView = ({
  formData,
  handlers,
  eventHandlers,
  isFormValid,
  PASSWORD_QUESTIONS,
}: SignUpViewProps) => {
  const {
    name,
    userId,
    email,
    phoneNumber,
    password,
    passwordCheck,
    passwordQuestionUid,
    questionAnswer,
  } = formData;

  const {
    handleChangeName,
    handleChangeUserId,
    handleChangeEmail,
    handleChangePhoneNumber,
    handleChangePassword,
    handleChangePasswordCheck,
    setPasswordQuestionUid,
    setQuestionAnswer,
  } = handlers;

  const { handleBlur, handleKeyDown, handleSubmit } = eventHandlers;

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
          <div className="w-full max-w-md p-3">
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "#164F9E",
                mb: 2,
                textAlign: "center",
              }}
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

              {/* Password Question Fields */}
              <FormControl fullWidth required>
                <InputLabel>비밀번호 찾기 질문</InputLabel>
                <Select
                  value={passwordQuestionUid}
                  onChange={(e) => setPasswordQuestionUid(e.target.value)}
                  label="비밀번호 찾기 질문"
                  onKeyDown={handleKeyDown}
                >
                  {PASSWORD_QUESTIONS.map((q) => (
                    <MenuItem key={q.uid} value={q.uid}>
                      {q.question}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                required
                label="비밀번호 찾기 답변"
                value={questionAnswer}
                onChange={(e) => setQuestionAnswer(e.target.value)}
                placeholder="질문에 대한 답변을 입력해주세요"
                onKeyDown={handleKeyDown}
              />
            </div>

            <Button
              text="가입하기"
              onClick={handleSubmit}
              disabled={!isFormValid}
              sx={{
                marginTop: "20px",
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
                mt: 2,
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

export default SignUpView;

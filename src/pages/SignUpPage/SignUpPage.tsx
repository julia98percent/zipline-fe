import apiClient from "@apis/apiClient";
import { useNavigate, Link } from "react-router-dom";
import useInput from "@hooks/useInput";
import NameInput from "./NameInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import Button from "@components/Button";
import PhoneNumberInput from "./PhoneNumberInput";
import UserIdInput from "./UserIdInput";
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
import { useState } from "react";
import { showToast } from "@components/Toast/Toast";

const isValidName = (name: string) => {
  return name.length >= 2 && name.length <= 20;
};

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
  const [passwordQuestionUid, setPasswordQuestionUid] = useState("1");
  const [questionAnswer, setQuestionAnswer] = useState("");

  const PASSWORD_QUESTIONS = [
    { uid: 1, question: "당신이 태어난 도시는 어디인가요?" },
    { uid: 2, question: "당신이 처음 다닌 학교의 이름은 무엇인가요?" },
    { uid: 3, question: "기억에 남는 선생님의 성함은 무엇인가요?" },
    { uid: 4, question: "당신이 가장 좋아하는 음식은 무엇인가요?" },
    { uid: 5, question: "당신이 처음 키운 반려동물의 이름은 무엇인가요?" },
    { uid: 6, question: "어릴 적 가장 친했던 친구의 이름은 무엇인가요?" },
    { uid: 7, question: "당신이 가장 좋아하는 영화는 무엇인가요?" },
    { uid: 8, question: "어릴 적 장래희망은 무엇이었나요?" },
  ];

  const handleBlur = (field: string, value: string) => {
    if (field === "passwordCheck") {
      if (password !== value) {
        showToast({
          message: "비밀번호가 일치하지 않습니다.",
          type: "error",
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      name &&
      userId &&
      email &&
      password &&
      passwordCheck &&
      phoneNumber &&
      questionAnswer &&
      isValidName(name) &&
      isValidUserId(userId) &&
      isValidEmail(email) &&
      isValidPassword(password) &&
      isValidPhoneNumber(phoneNumber) &&
      password === passwordCheck
    ) {
      handleClickSignUpButton();
    }
  };

  const handleClickSignUpButton = () => {
    if (!isValidName(name)) {
      showToast({
        message: "이름을 올바르게 입력해주세요.",
        type: "error",
      });
      return;
    }
    if (!isValidUserId(userId)) {
      showToast({
        message: "아이디를 올바르게 입력해주세요.",
        type: "error",
      });
      return;
    }
    if (!isValidEmail(email)) {
      showToast({
        message: "이메일을 올바르게 입력해주세요.",
        type: "error",
      });
      return;
    }
    if (!isValidPassword(password)) {
      showToast({
        message: "비밀번호를 올바르게 입력해주세요.",
        type: "error",
      });
      return;
    }
    if (password !== passwordCheck) {
      showToast({
        message: "비밀번호가 일치하지 않습니다.",
        type: "error",
      });
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      showToast({
        message: "전화번호를 올바르게 입력해주세요.",
        type: "error",
      });
      return;
    }
    if (!questionAnswer) {
      showToast({
        message: "비밀번호 찾기 답변을 입력해주세요.",
        type: "error",
      });
      return;
    }

    apiClient
      .post("/users/signup", {
        id: userId,
        password,
        passwordCheck,
        passwordQuestionUid: Number(passwordQuestionUid),
        questionAnswer,
        name,
        phoneNo: phoneNumber,
        email,
      })
      .then((res) => {
        if (res.status === 201) {
          showToast({
            message: "회원가입에 성공했습니다.",
            type: "success",
          });
          navigate("/sign-in");
        }
      })
      .catch((error) => {
        const msg = error.response?.data?.message;
        showToast({
          message: msg || "회원가입 중 오류가 발생했습니다.",
          type: "error",
        });
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
                onKeyDown={handleKeyDown}
              />
              <UserIdInput
                userId={userId}
                handleChangeUserId={handleChangeUserId}
                onBlur={() => handleBlur("userId", userId)}
                onKeyDown={handleKeyDown}
              />
              <EmailInput
                email={email}
                handleChangeEmail={handleChangeEmail}
                onBlur={() => handleBlur("email", email)}
                onKeyDown={handleKeyDown}
              />
              <PasswordInput
                password={password}
                passwordCheck={passwordCheck}
                handleChangePassword={handleChangePassword}
                handleChangePasswordCheck={handleChangePasswordCheck}
                onKeyDown={handleKeyDown}
              />
              <PhoneNumberInput
                phoneNumber={phoneNumber}
                handleChangePhoneNumber={handleChangePhoneNumber}
                onBlur={() => handleBlur("phoneNumber", phoneNumber)}
                onKeyDown={handleKeyDown}
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
              onClick={handleClickSignUpButton}
              disabled={
                !name ||
                !userId ||
                !email ||
                !password ||
                !passwordCheck ||
                !phoneNumber ||
                !questionAnswer ||
                !isValidName(name) ||
                !isValidUserId(userId) ||
                !isValidEmail(email) ||
                !isValidPassword(password) ||
                !isValidPhoneNumber(phoneNumber) ||
                password !== passwordCheck
              }
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

export default SignUpPage;

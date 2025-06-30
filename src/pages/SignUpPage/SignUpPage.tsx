import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "@apis/userService";
import useInput from "@hooks/useInput";
import { showToast } from "@components/Toast";
import SignUpView from "./SignUpView";
import { USER_ERROR_MESSAGES } from "@constants/clientErrorMessage";

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

  const isFormValid = () => {
    return (
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
    );
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (!isValidName(value)) {
          showToast({
            message: "이름을 올바르게 입력해주세요.",
            type: "error",
          });
          return false;
        }
        break;
      case "userId":
        if (!isValidUserId(value)) {
          showToast({
            message: "아이디를 올바르게 입력해주세요.",
            type: "error",
          });
          return false;
        }
        break;
      case "email":
        if (!isValidEmail(value)) {
          showToast({
            message: "이메일을 올바르게 입력해주세요.",
            type: "error",
          });
          return false;
        }
        break;
      case "password":
        if (!isValidPassword(value)) {
          showToast({
            message: "비밀번호를 올바르게 입력해주세요.",
            type: "error",
          });
          return false;
        }
        break;
      case "passwordCheck":
        if (password !== value) {
          showToast({
            message: "비밀번호가 일치하지 않습니다.",
            type: "error",
          });
          return false;
        }
        break;
      case "phoneNumber":
        if (!isValidPhoneNumber(value)) {
          showToast({
            message: "전화번호를 올바르게 입력해주세요.",
            type: "error",
          });
          return false;
        }
        break;
      case "questionAnswer":
        if (!value) {
          showToast({
            message: "비밀번호 찾기 답변을 입력해주세요.",
            type: "error",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleBlur = (field: string, value: string) => {
    if (field === "passwordCheck") {
      validateField(field, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormValid()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!validateField("name", name)) return;
    if (!validateField("userId", userId)) return;
    if (!validateField("email", email)) return;
    if (!validateField("password", password)) return;
    if (!validateField("passwordCheck", passwordCheck)) return;
    if (!validateField("phoneNumber", phoneNumber)) return;
    if (!validateField("questionAnswer", questionAnswer)) return;

    try {
      const res = await signupUser({
        userId,
        password,
        passwordCheck,
        passwordQuestionUid: Number(passwordQuestionUid),
        questionAnswer,
        name,
        phoneNumber,
        email,
      });

      if (res.status === 201) {
        showToast({
          message: "회원가입에 성공했습니다.",
          type: "success",
        });
        navigate("/sign-in");
      }
    } catch (error: unknown) {
      console.error("SignUp error:", error);

      let errorMessage: string = USER_ERROR_MESSAGES.SIGNUP_FAILED;

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const genericError = error as { message: string };
        errorMessage = genericError.message;
      }

      showToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  const viewProps = {
    formData: {
      name,
      userId,
      email,
      phoneNumber,
      password,
      passwordCheck,
      passwordQuestionUid,
      questionAnswer,
    },

    handlers: {
      handleChangeName,
      handleChangeUserId,
      handleChangeEmail,
      handleChangePhoneNumber,
      handleChangePassword,
      handleChangePasswordCheck,
      setPasswordQuestionUid,
      setQuestionAnswer,
    },

    eventHandlers: {
      handleBlur,
      handleKeyDown,
      handleSubmit,
    },

    isFormValid: Boolean(isFormValid()),

    PASSWORD_QUESTIONS,
  };

  return <SignUpView {...viewProps} />;
};

export default SignUpPage;

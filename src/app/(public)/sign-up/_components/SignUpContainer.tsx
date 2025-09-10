"use client";

import { useRouter } from "next/navigation";
import { signupUser } from "@/apis/userService";
import useInput from "@/hooks/useInput";
import { showToast } from "@/components/Toast";
import SignUpView from "./SignUpView";
import { USER_ERROR_MESSAGES } from "@/constants/clientErrorMessage";

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
  const router = useRouter();

  const [name, handleChangeName] = useInput("");
  const [userId, handleChangeUserId] = useInput("");
  const [email, handleChangeEmail] = useInput("");
  const [phoneNumber, handleChangePhoneNumber] = useInput("");
  const [password, handleChangePassword] = useInput("");
  const [passwordCheck, handleChangePasswordCheck] = useInput("");

  const isFormValid = () => {
    return (
      name &&
      userId &&
      email &&
      password &&
      passwordCheck &&
      phoneNumber &&
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

  const handleSubmit = async () => {
    if (!validateField("name", name)) return;
    if (!validateField("userId", userId)) return;
    if (!validateField("email", email)) return;
    if (!validateField("password", password)) return;
    if (!validateField("passwordCheck", passwordCheck)) return;
    if (!validateField("phoneNumber", phoneNumber)) return;

    try {
      const res = await signupUser({
        userId,
        password,
        passwordCheck,
        name,
        phoneNumber,
        email,
      });

      if (res.status === 201) {
        showToast({
          message: "회원가입에 성공했습니다.",
          type: "success",
        });
        router.replace("/sign-in");
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
    },

    handlers: {
      handleChangeName,
      handleChangeUserId,
      handleChangeEmail,
      handleChangePhoneNumber,
      handleChangePassword,
      handleChangePasswordCheck,
    },

    eventHandlers: {
      handleBlur,
      handleSubmit,
    },

    isFormValid: Boolean(isFormValid()),
  };

  return <SignUpView {...viewProps} />;
};

export default SignUpPage;

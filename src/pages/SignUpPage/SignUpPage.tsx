import { useState } from "react";
import apiClient from "@apis/apiClient";
import { useNavigate, Link } from "react-router-dom";
import useInput from "@hooks/useInput";
import Header from "./Header";
import NameInput from "./NameInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import Button from "@components/Button";
import PhoneNumberInput from "./PhoneNumberInput";
import BirthdayInput from "./BirthdayInput";
import UserIdInput from "./UserIdInput";
import { Dayjs } from "dayjs";
import { Box, Typography } from "@mui/material";

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

const isValidBirthday = (birth: string) => /^\d{8}$/.test(birth); // YYYYMMDD 형식

const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, handleChangeName] = useInput("");
  const [userId, handleChangeUserId] = useInput("");
  const [email, handleChangeEmail] = useInput("");
  const [birthday, setBirthday] = useState<Dayjs | null>(null);
  const [phoneNumber, handleChangePhoneNumber] = useInput("");
  const [password, handleChangePassword] = useInput("");
  const [passwordCheck, handleChangePasswordCheck] = useInput("");
  const [errorMessage, setErrorMessage] = useState("");

  const isSignUpButtonDisabled =
    name == "" ||
    userId == "" ||
    !email ||
    !password ||
    !passwordCheck ||
    !phoneNumber ||
    birthday == null;

  const handleClickSignUpButton = () => {
    if (!isValidUserId(userId)) {
      setErrorMessage("아이디는 영문과과 숫자를 포함해 4~12자로 입력해주세요.");
      return;
    }
    if (!isValidPassword(password)) {
      setErrorMessage(
        "비밀번호는 영문, 숫자, 특수문자를 포함해 8~20자로 입력해주세요."
      );
      return;
    }
    if (password !== passwordCheck) {
      setErrorMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    if (!birthday || !isValidBirthday(birthday.format("YYYYMMDD"))) {
      setErrorMessage("생년월일은 8자리 (예: 19901210)로 입력해주세요.");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage(
        "유효한 이메일 형식을 입력해주세요. 예: example@domain.com"
      );
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      setErrorMessage("전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678");
      return;
    }
    apiClient
      .post("/users/signup", {
        id: userId,
        password,
        passwordCheck,
        name,
        birthday: Number(birthday.format("YYYYMMDD")),
        phoneNo: phoneNumber,
        email,
        noticeMonth: 0,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("회원가입에 성공했습니다.");
          navigate("/sign-in");
        }
      })
      .catch((error) => {
        const msg = error.response?.data?.message;
        setErrorMessage(msg || "회원가입 중 오류가 발생했습니다.");
        console.log(error);
      });
  };

  return (
    <div className="p-[24px]">
      <Header />
      <div className="grid gap-[16px]">
        <NameInput name={name} handleChangeName={handleChangeName} />
        <UserIdInput userId={userId} handleChangeUserId={handleChangeUserId} />
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
        <BirthdayInput birthday={birthday} handleChangeBirthday={setBirthday} />
      </div>

      <Button
        text="가입하기"
        onClick={handleClickSignUpButton}
        disabled={isSignUpButtonDisabled}
        sx={{
          marginTop: "16px",
          width: "100%",
          color: "white",
          minHeight: "32px",
          backgroundColor: "#2E5D9F",
          "&:disabled": {
            backgroundColor: "lightgray",
            color: "white",
          },
        }}
      />
      {errorMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Typography variant="body2">이미 회원이신가요?</Typography>
        <Link to="/sign-in" className="flex items-center">
          <Button
            text="로그인"
            sx={{
              color: "#2E5D9F",
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
  );
};

export default SignUpPage;

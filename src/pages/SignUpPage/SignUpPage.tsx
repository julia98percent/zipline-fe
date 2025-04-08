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

const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, handleChangeName] = useInput("");
  const [userId, handleChangeUserId] = useInput("");
  const [email, handleChangeEmail] = useInput("");
  const [birthday, setBirthday] = useState<Dayjs | null>(null);
  const [phoneNumber, handleChangePhoneNumber] = useInput("");
  const [password, handleChangePassword] = useInput("");
  const [passwordCheck, handleChangePasswordCheck] = useInput("");

  const isSignUpButtonDisabled =
    name == "" ||
    userId == "" ||
    !email ||
    !password ||
    !passwordCheck ||
    password !== passwordCheck ||
    !phoneNumber ||
    birthday == null;

  const handleClickSignUpButton = () => {
    apiClient
      .post("/users/signup", {
        id: userId,
        password,
        passwordCheck,
        name,
        birthday: 0,
        phoneNo: phoneNumber,
        email,
        noticeMonth: 0,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("가입 성공~~");
          navigate("/sign-in");
        }
      })
      .catch((error) => {
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

import apiClient from "@apis/apiClient";
import { useNavigate } from "react-router-dom";
import useInput from "@hooks/useInput";
import Header from "./Header";
import UserIdInput from "./UserIdInput";
import PasswordInput from "./PasswordInput";
import Button from "@components/Button";

const SignInPage = () => {
  const navigate = useNavigate();
  const [userId, handleChangeUserId] = useInput("");
  const [password, handleChangePassword] = useInput("");

  const isSignUpButtonDisabled = !userId || !password;

  const handleClickSignUpButton = () => {
    apiClient
      .post("/users/login", {
        id: userId,
        password,
      })
      .then((res) => {
        const accessToken = res?.data?.data?.accessToken;
        if (res.status === 200 && accessToken) {
          sessionStorage.setItem("_ZA", accessToken);
          navigate("/");
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
        <UserIdInput userId={userId} handleChangeUserId={handleChangeUserId} />
        <PasswordInput
          password={password}
          handleChangePassword={handleChangePassword}
        />
      </div>

      <Button
        text="로그인"
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
    </div>
  );
};

export default SignInPage;

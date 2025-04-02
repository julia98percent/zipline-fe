import axios from "axios";
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
    axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/user/login`,
        {
          id: userId,
          password,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("_ZA") || ""}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200 && res?.data?.data?.accessToken) {
          sessionStorage.setItem("_ZA", res.data.data.accessToken);
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

import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface PasswordInputProps {
  password: string;
  passwordCheck: string;
  handleChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangePasswordCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({
  password,
  passwordCheck,
  handleChangePassword,
  handleChangePasswordCheck,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordCheck = () =>
    setShowPasswordCheck((show) => !show);

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handleChangePassword}
        fullWidth
        required
        variant="outlined"
        helperText="영문, 숫자, 특수문자를 포함해 8~20자로 입력해주세요."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#164F9E",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#164F9E",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#164F9E",
          },
        }}
      />
      <TextField
        label="비밀번호 확인"
        type={showPasswordCheck ? "text" : "password"}
        value={passwordCheck}
        onChange={handleChangePasswordCheck}
        fullWidth
        required
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPasswordCheck}
                edge="end"
              >
                {showPasswordCheck ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#164F9E",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#164F9E",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#164F9E",
          },
        }}
      />
    </div>
  );
};

export default PasswordInput;

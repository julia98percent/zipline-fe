import { ChangeEvent } from "react";
import { TextField, Tooltip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TextFieldComponent from "@components/TextField";

export interface PasswordInputProps {
  password: string;
  passwordCheck: string;
  handleChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangePasswordCheck: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const isValidPassword = (pw: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}$/.test(
    pw
  );

const PasswordInput = ({
  password,
  passwordCheck,
  handleChangePassword,
  handleChangePasswordCheck,
  error,
  helperText,
  onBlur,
  onKeyDown,
}: PasswordInputProps) => {
  const isPasswordError = error || (password && !isValidPassword(password));
  const isPasswordCheckError =
    error || (passwordCheck && password !== passwordCheck);

  const passwordErrorMessage =
    helperText ||
    (password && !isValidPassword(password)
      ? "영문, 숫자, 특수문자를 포함해 8~20자로 입력해주세요"
      : "");

  const passwordCheckErrorMessage =
    helperText ||
    (passwordCheck && password !== passwordCheck
      ? "비밀번호가 일치하지 않습니다"
      : "");

  return (
    <>
      <div style={{ position: "relative" }}>
        <TextFieldComponent
          fullWidth
          required
          type="password"
          label="비밀번호"
          value={password}
          onChange={handleChangePassword}
          onBlur={onBlur}
          error={isPasswordError}
          placeholder="영문, 숫자, 특수문자를 포함해 8~20자로 입력해주세요"
          InputProps={{
            endAdornment: isPasswordError && (
              <Tooltip title={passwordErrorMessage} arrow placement="right">
                <ErrorOutlineIcon color="error" sx={{ cursor: "help" }} />
              </Tooltip>
            ),
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      <div style={{ position: "relative" }}>
        <TextFieldComponent
          fullWidth
          required
          type="password"
          label="비밀번호 확인"
          value={passwordCheck}
          onChange={handleChangePasswordCheck}
          onBlur={onBlur}
          error={isPasswordCheckError}
          placeholder="비밀번호를 다시 입력해주세요"
          InputProps={{
            endAdornment: isPasswordCheckError && (
              <Tooltip
                title={passwordCheckErrorMessage}
                arrow
                placement="right"
              >
                <ErrorOutlineIcon color="error" sx={{ cursor: "help" }} />
              </Tooltip>
            ),
          }}
          onKeyDown={onKeyDown}
        />
      </div>
    </>
  );
};

export default PasswordInput;

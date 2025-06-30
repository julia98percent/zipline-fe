import { ChangeEvent } from "react";
import { TextField } from "@mui/material";

export interface PasswordCheckInputProps {
  passwordCheck: string;
  handleChangePasswordCheck: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
}

const PasswordCheckInput = ({
  passwordCheck,
  handleChangePasswordCheck,
  error,
  helperText,
  onBlur,
}: PasswordCheckInputProps) => {
  return (
    <TextField
      fullWidth
      required
      type="password"
      label="비밀번호 확인"
      value={passwordCheck}
      onChange={handleChangePasswordCheck}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      placeholder="비밀번호를 한 번 더 입력해주세요"
    />
  );
};

export default PasswordCheckInput;

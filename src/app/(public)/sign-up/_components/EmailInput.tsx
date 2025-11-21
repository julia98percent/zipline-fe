import { ChangeEvent } from "react";
import { Tooltip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TextField from "@/components/TextField";
import { PRIMARY } from "@/constants/colors";

export interface EmailInputProps {
  email: string;
  handleChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const isValidEmail = (email: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

const EmailInput = ({
  email,
  handleChangeEmail,
  error,
  helperText,
  onBlur,
  onKeyDown,
}: EmailInputProps) => {
  const isError = error || Boolean(email && !isValidEmail(email));
  const errorMessage =
    helperText ||
    (email && !isValidEmail(email) ? "올바른 이메일 형식을 입력해주세요" : "");

  return (
    <TextField
      label="이메일"
      value={email}
      onChange={handleChangeEmail}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      fullWidth
      required
      variant="outlined"
      type="email"
      error={isError}
      placeholder="example@domain.com"
      InputProps={{
        endAdornment: isError && (
          <Tooltip title={errorMessage} arrow placement="right">
            <ErrorOutlineIcon color="error" className="cursor-help" />
          </Tooltip>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: PRIMARY.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: PRIMARY.main,
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: PRIMARY.main,
        },
      }}
    />
  );
};

export default EmailInput;

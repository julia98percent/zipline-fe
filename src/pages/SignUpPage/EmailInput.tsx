import { ChangeEvent } from "react";
import { TextField, Tooltip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export interface EmailInputProps {
  email: string;
  handleChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
}

const isValidEmail = (email: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

const EmailInput = ({
  email,
  handleChangeEmail,
  error,
  helperText,
  onBlur,
}: EmailInputProps) => {
  const isError = error || (email && !isValidEmail(email));
  const errorMessage =
    helperText ||
    (email && !isValidEmail(email) ? "올바른 이메일 형식을 입력해주세요" : "");

  return (
    <div style={{ position: "relative" }}>
      <TextField
        label="이메일"
        value={email}
        onChange={handleChangeEmail}
        onBlur={onBlur}
        fullWidth
        required
        variant="outlined"
        type="email"
        error={isError}
        placeholder="example@domain.com"
        InputProps={{
          endAdornment: isError && (
            <Tooltip title={errorMessage} arrow placement="right">
              <ErrorOutlineIcon color="error" sx={{ cursor: "help" }} />
            </Tooltip>
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

export default EmailInput;

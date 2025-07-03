import { ChangeEvent } from "react";
import { TextField, Tooltip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export interface UserIdInputProps {
  userId: string;
  handleChangeUserId: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const isValidUserId = (id: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/.test(id);

const UserIdInput = ({
  userId,
  handleChangeUserId,
  error,
  helperText,
  onBlur,
  onKeyDown,
}: UserIdInputProps) => {
  const isError = !!(error || (userId && !isValidUserId(userId)));
  const errorMessage =
    helperText ||
    (userId && !isValidUserId(userId)
      ? "영문과 숫자를 포함해 4~12자로 입력해주세요"
      : "");

  return (
    <div style={{ position: "relative" }}>
      <TextField
        required
        label="아이디"
        value={userId}
        onChange={handleChangeUserId}
        onKeyDown={onKeyDown}
        fullWidth
        onBlur={onBlur}
        error={isError}
        placeholder="영문과 숫자를 포함해 4~12자로 입력해주세요"
        InputProps={{
          endAdornment: isError && (
            <Tooltip title={errorMessage} arrow placement="right">
              <ErrorOutlineIcon color="error" sx={{ cursor: "help" }} />
            </Tooltip>
          ),
        }}
      />
    </div>
  );
};

export default UserIdInput;

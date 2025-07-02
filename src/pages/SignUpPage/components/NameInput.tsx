import { ChangeEvent } from "react";
import { Tooltip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TextField from "@components/TextField";

export interface NameInputProps {
  name: string;
  handleChangeName: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const isValidName = (name: string) => {
  return name.length >= 2 && name.length <= 20;
};

const NameInput = ({
  name,
  handleChangeName,
  error,
  helperText,
  onBlur,
  onKeyDown,
}: NameInputProps) => {
  const isError = error || (name && !isValidName(name));
  const errorMessage =
    helperText ||
    (name && !isValidName(name)
      ? "이름은 2자 이상 20자 이하로 입력해주세요"
      : "");

  return (
    <div style={{ position: "relative" }}>
      <TextField
        fullWidth
        required
        label="이름"
        value={name}
        onChange={handleChangeName}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        error={isError}
        placeholder="2자 이상 20자 이하로 입력해주세요"
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

export default NameInput;

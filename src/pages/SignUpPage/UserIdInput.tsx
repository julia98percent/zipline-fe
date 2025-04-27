import { TextField } from "@mui/material";

interface UserIdInputProps {
  userId: string;
  handleChangeUserId: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserIdInput = ({ userId, handleChangeUserId }: UserIdInputProps) => {
  return (
    <TextField
      label="아이디"
      value={userId}
      onChange={handleChangeUserId}
      fullWidth
      required
      variant="outlined"
      helperText="영문과 숫자를 포함해 4~12자로 입력해주세요."
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
  );
};

export default UserIdInput;

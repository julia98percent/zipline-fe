import { TextField } from "@mui/material";

interface EmailInputProps {
  email: string;
  handleChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput = ({ email, handleChangeEmail }: EmailInputProps) => {
  return (
    <TextField
      label="이메일"
      value={email}
      onChange={handleChangeEmail}
      fullWidth
      required
      variant="outlined"
      type="email"
      helperText="예: example@domain.com"
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

export default EmailInput;
